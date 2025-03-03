import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { type, inputs, results, userId } = await req.json()
    
    const calculation = await prisma.calculation.create({
      data: {
        type,
        inputs,
        results,
        userId,
      },
    })

    return NextResponse.json(calculation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error saving calculation' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    const calculations = await prisma.calculation.findMany({
      where: { userId: userId! },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(calculations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching calculations' },
      { status: 500 }
    )
  }
} 