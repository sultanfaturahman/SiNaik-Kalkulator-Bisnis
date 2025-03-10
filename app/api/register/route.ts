import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { validateRequest } from '@/lib/middlewares/validateRequest'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

const prisma = new PrismaClient()

async function registerHandler(data: RegisterInput) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Create user with type field
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        type: data.selectedType // Add the type field
      },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        businessAddress: true,
        type: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Detailed registration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = validateRequest(registerSchema, registerHandler)
