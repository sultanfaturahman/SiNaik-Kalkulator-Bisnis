import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    console.log('GET request params:', { type, userId: session.user.id });

    const calculations = await prisma.calculation.findMany({
      where: {
        userId: session.user.id,
        type: type || undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found calculations:', calculations);
    
    return NextResponse.json(calculations);
  } catch (error) {
    console.error('GET calculations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST request body:', body);

    const calculation = await prisma.calculation.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    console.log('Created calculation:', calculation);
    
    return NextResponse.json(calculation);
  } catch (error) {
    console.error('POST calculation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
