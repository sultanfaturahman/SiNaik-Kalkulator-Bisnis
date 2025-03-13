import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { businessName, businessAddress, selectedType } = await req.json();

    if (!businessName || !businessAddress || !selectedType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user with business details
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        businessName,
        businessAddress,
        type: selectedType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating business details:", error);
    return NextResponse.json(
      { error: "Failed to update business details" },
      { status: 500 }
    );
  }
}
