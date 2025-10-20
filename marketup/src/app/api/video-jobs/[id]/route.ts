import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = await prisma.videoJob.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ status: job.status, videoUrl: job.videoUrl });
}


