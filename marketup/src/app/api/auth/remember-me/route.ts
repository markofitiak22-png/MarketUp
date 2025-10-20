import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rememberMe } = await request.json();
    
    if (rememberMe) {
      // Generate a secure remember me token
      const rememberToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      // Store the token in database
      await prisma.session.updateMany({
        where: { 
          userId: session.user.id,
          expires: { gt: new Date() }
        },
        data: {
          rememberMe: true,
          expires: expiresAt
        }
      });

      // Set secure cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('remember_me', rememberToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      });
      
      return response;
    } else {
      // Remove remember me token
      await prisma.session.updateMany({
        where: { 
          userId: session.user.id,
          expires: { gt: new Date() }
        },
        data: {
          rememberMe: false
        }
      });

      const response = NextResponse.json({ success: true });
      response.cookies.delete('remember_me');
      return response;
    }
  } catch (error) {
    console.error('Remember me error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear all remember me sessions for this user
    await prisma.session.updateMany({
      where: { 
        userId: session.user.id,
        rememberMe: true
      },
      data: {
        rememberMe: false
      }
    });

    const response = NextResponse.json({ success: true });
    response.cookies.delete('remember_me');
    return response;
  } catch (error) {
    console.error('Clear remember me error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
