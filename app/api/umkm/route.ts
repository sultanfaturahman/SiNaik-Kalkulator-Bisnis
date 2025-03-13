import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Calculation } from '@prisma/client';

interface UmkmData {
  id: string;
  name: string;
  businessAddress: string | null;
  annualGrossProfit: number;
}

interface CategorizedUmkm {
  'ultra-mikro': UmkmData[];
  'super-mikro': UmkmData[];
  'mikro': UmkmData[];
  'kecil': UmkmData[];
  'status-umkm-naik-kelas': UmkmData[];
}

export async function GET() {
  try {
    // Get all UMKM users with their calculations
    const umkmUsers = await prisma.user.findMany({
      where: {
        type: "umkm"
      },
      include: {
        calculations: {
          where: {
            type: "kalkulator-laba-kotor-harian"
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    // Initialize categorized UMKM object
    const categorizedUmkm: CategorizedUmkm = {
      'ultra-mikro': [],
      'super-mikro': [],
      'mikro': [],
      'kecil': [],
      'status-umkm-naik-kelas': []
    };

    for (const user of umkmUsers) {
      // Calculate annual gross profit
      const annualGrossProfit = user.calculations.reduce((total: number, calc: Calculation) => {
        const results = calc.results as { grossProfit: number };
        return total + (results.grossProfit || 0);
      }, 0);

      const umkmData: UmkmData = {
        id: user.id,
        name: user.businessName || user.name || '',
        businessAddress: user.businessAddress,
        annualGrossProfit
      };

      // Categorize based on annual gross profit
      if (annualGrossProfit < 30000000) {
        categorizedUmkm['ultra-mikro'].push(umkmData);
      } else if (annualGrossProfit <= 60000000) {
        categorizedUmkm['super-mikro'].push(umkmData);
      } else if (annualGrossProfit <= 167000000) {
        categorizedUmkm['mikro'].push(umkmData);
      } else if (annualGrossProfit <= 4800000000) {
        categorizedUmkm['kecil'].push(umkmData);
      } else {
        categorizedUmkm['status-umkm-naik-kelas'].push(umkmData);
      }
    }

    return NextResponse.json(categorizedUmkm);
  } catch (error) {
    console.error('Error fetching UMKM data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UMKM data' },
      { status: 500 }
    );
  }
}
