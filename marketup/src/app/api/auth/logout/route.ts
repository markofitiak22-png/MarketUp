import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      // Clear remember me sessions for this user
      await prisma.session.updateMany({
        where: { 
          userId: session.user.id,
          rememberMe: true
        },
        data: {
          rememberMe: false
        }
      });
    }

    const response = NextResponse.json({ success: true });
    
    // Clear remember me cookie
    response.cookies.delete('remember_me');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
