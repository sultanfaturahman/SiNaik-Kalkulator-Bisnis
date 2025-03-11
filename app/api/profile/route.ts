import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        businessName: true,
        businessAddress: true,
        type: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name || '',
      email: user.email,
      businessName: user.businessName || '',
      businessAddress: user.businessAddress || '',
      userType: user.type || 'umkm'
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, businessName, businessAddress } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        businessName,
        businessAddress,
      },
      select: {
        name: true,
        email: true,
        businessName: true,
        businessAddress: true,
        type: true,
      }
    });

    return NextResponse.json({
      name: updatedUser.name || '',
      email: updatedUser.email,
      businessName: updatedUser.businessName || '',
      businessAddress: updatedUser.businessAddress || '',
      userType: updatedUser.type || 'umkm'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}