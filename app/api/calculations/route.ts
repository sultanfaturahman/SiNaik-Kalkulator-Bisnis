import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const now = new Date()
    const calculation = await prisma.$queryRaw<Array<any>>`
      INSERT INTO "Calculation" (type, inputs, results, date, "createdAt", "updatedAt")
      VALUES (${body.type}, ${body.inputs}, ${body.results}, ${now}, ${now}, ${now})
      RETURNING *
    `
    return NextResponse.json(calculation[0])
  } catch (error) {
    console.error('Error saving calculation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save calculation' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange')
    const type = searchParams.get('type')

    // Test database connection first
    await prisma.$queryRaw`SELECT 1`

    let data
    if (!dateRange || dateRange === 'all') {
      if (!type || type === 'all') {
        data = await prisma.calculation.findMany({
          orderBy: { date: 'desc' }
        })
      } else {
        data = await prisma.calculation.findMany({
          where: { type },
          orderBy: { date: 'desc' }
        })
      }
    } else {
      const now = new Date()
      let startDate = new Date()

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      data = await prisma.calculation.findMany({
        where: {
          date: {
            gte: startDate,
            lte: now
          }
        },
        orderBy: { date: 'desc' }
      })
    }

    if (!data) {
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Database error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 