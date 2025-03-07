import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const grossProfit = body.grossProfit

    let category = ''
    if (grossProfit < 30000000) {
      category = 'UMKM Ultra Mikro'
    } else if (grossProfit <= 60000000) {
      category = 'UMKM Super Mikro'
    } else if (grossProfit <= 167000000) {
      category = 'UMKM Mikro'
    } else {
      category = 'Laba kotor melebihi batas UMKM Mikro'
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error processing gross profit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process gross profit' },
      { status: 500 }
    )
  }
} 