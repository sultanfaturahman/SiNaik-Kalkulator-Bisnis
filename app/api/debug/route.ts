import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get all calculations from the database
    const calculations = await prisma.calculation.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      count: calculations.length,
      calculations: calculations
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}