import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { verifyJwtToken } from '@/lib/jwt'

export const runtime = 'nodejs'

async function getUserFromToken(request: Request) {
  const cookieStore = await cookies()
  const token = await cookieStore.get('token')?.value
  if (!token) {
    return null
  }
  
  try {
    const payload = await verifyJwtToken(token)
    return payload.userId
  } catch (error) {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const calculations = await prisma.calculation.findMany({
      where: {
        userId
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(calculations)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, inputs, results } = body

    const calculation = await prisma.calculation.create({
      data: {
        type,
        inputs,
        results,
        date: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: userId
          }
        }
      }
    })

    return NextResponse.json(calculation, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create calculation' },
      { status: 500 }
    )
  }
}
