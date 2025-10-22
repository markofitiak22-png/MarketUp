import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  script: z.string().min(10),
  backgroundImageUrls: z.array(z.string().url()).min(1).max(6),
  productImageUrls: z.array(z.string().url()).max(6),
  contactAddress: z.string().optional(),
  contactPhone: z.string().optional(),
  logoImageUrl: z.string().url().optional(),
  meta: z.object({ avatar: z.string(), language: z.string(), voice: z.string() }).optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;
  const job = await prisma.videoJob.create({
    data: {
      script: d.script,
      backgroundImageUrls: d.backgroundImageUrls as string[],
      productImageUrls: d.productImageUrls as string[],
      contactAddress: d.contactAddress,
      contactPhone: d.contactPhone,
      logoImageUrl: d.logoImageUrl,
      status: "PROCESSING",
      provider: "MOCK",
    },
  });
  return NextResponse.json({ id: job.id });
}


