import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const umkmId = params.id;

    const umkm = await prisma.user.findUnique({
      where: {
        id: umkmId,
        type: "umkm"
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        businessAddress: true,
        email: true,
        createdAt: true,
        calculations: {
          where: {
            type: "kalkulator-laba-kotor-harian"
          },
          orderBy: {
            date: 'desc'
          },
          select: {
            date: true,
            inputs: true,
            results: true
          }
        }
      }
    });

    if (!umkm) {
      return NextResponse.json(
        { error: 'UMKM not found' },
        { status: 404 }
      );
    }

    // Calculate total gross profit
    const totalGrossProfit = umkm.calculations.reduce((total, calc) => {
      const results = calc.results as { grossProfit: number };
      return total + (results.grossProfit || 0);
    }, 0);

    // Determine UMKM category
    let category = '';
    if (totalGrossProfit < 30000000) {
      category = 'Ultra Mikro';
    } else if (totalGrossProfit <= 60000000) {
      category = 'Super Mikro';
    } else if (totalGrossProfit <= 167000000) {
      category = 'Mikro';
    } else if (totalGrossProfit <= 4800000000) {
      category = 'Kecil';
    } else {
      category = 'UMKM Naik Kelas';
    }

    const response = {
      ...umkm,
      totalGrossProfit,
      category
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching UMKM details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UMKM details' },
      { status: 500 }
    );
  }
}
