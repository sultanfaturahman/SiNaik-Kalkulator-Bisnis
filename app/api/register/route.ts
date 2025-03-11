import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { validateRequest } from '@/lib/middlewares/validateRequest'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

const prisma = new PrismaClient()

async function registerHandler(data: RegisterInput) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        type: data.selectedType,
        // For now, we'll leave emailVerified as null
        // You should implement email verification logic here
        emailVerified: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        businessAddress: true,
        type: true,
        emailVerified: true,
        createdAt: true
      }
    })

    // Here you would typically:
    // 1. Generate a verification token
    // 2. Send verification email
    // 3. Store the token in the database

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.',
        user 
      },
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
