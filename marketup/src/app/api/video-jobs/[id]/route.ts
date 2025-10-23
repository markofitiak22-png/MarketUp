import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await prisma.videoJob.findUnique({ where: { id: resolvedParams.id } });
  if (!job) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ status: job.status, videoUrl: job.videoUrl });
}


