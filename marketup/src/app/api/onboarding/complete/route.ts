import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { country, language, backgroundImageUrl, videoImageUrl } = body;

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile with onboarding data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        country: country || undefined,
        // Store onboarding preferences (you might want to add these fields to the schema)
        // For now, we'll just update the country
      },
    });

    // Store onboarding data in a separate table or as JSON
    // For now, we'll just return success
    // You can extend this to store backgroundImageUrl and videoImageUrl if needed

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error: any) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

