import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveSubscriptionForUser } from "@/lib/subscriptions";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const isVercel = process.env.VERCEL === "1";

async function saveImageFile(file: File, type: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const folder = type === "background" ? "backgrounds" : "video-images";
  const filename = `${folder}/onboarding_${timestamp}.${extension}`;

  if (isVercel) {
    // Use Vercel Blob Storage
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    });
    return blob.url;
  } else {
    // Local: save to public directory
    const uploadsDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, `onboarding_${timestamp}.${extension}`);
    await fs.writeFile(filePath, buffer);
    return `/${folder}/onboarding_${timestamp}.${extension}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const type = String(form.get("type") || "");

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!type || (type !== "background" && type !== "video-image")) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Check subscription for background uploads
    if (type === "background") {
      const user = await prisma.user.findUnique({
        where: { email: (session as any).user.email },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const subscription = await getActiveSubscriptionForUser(user.id);
      const tier = subscription?.tier || null;

      // Only STANDARD and PREMIUM plans can upload custom backgrounds
      if (!tier || tier === "BASIC") {
        return NextResponse.json(
          {
            error: "Custom background upload is only available for Pro and Premium plans",
            requiresUpgrade: true,
          },
          { status: 403 }
        );
      }
    }

    // Save file
    const url = await saveImageFile(file, type);

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

