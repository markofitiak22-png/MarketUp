import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return NextResponse.json({ name: user?.name || null, locale: user?.locale || null, country: user?.country || null, email: user?.email });
}

const updateSchema = z.object({ 
  name: z.string().max(100).optional(), 
  locale: z.string().max(5).optional(), 
  country: z.string().max(56).optional() 
});
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  
  const json = await request.json();
  console.log("Profile PATCH - Received data:", json);
  
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    console.log("Profile PATCH - Validation failed:", parsed.error);
    return NextResponse.json({ error: "invalid_input", details: parsed.error }, { status: 400 });
  }
  
  console.log("Profile PATCH - Validated data:", parsed.data);
  
  // Filter out empty strings and convert to null
  const dataToUpdate = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [
      key, 
      value === "" ? null : value
    ])
  );
  
  console.log("Profile PATCH - Data to update:", dataToUpdate);
  
  const updated = await prisma.user.update({ where: { email: session.user.email }, data: dataToUpdate });
  console.log("Profile PATCH - Updated user:", updated);
  
  return NextResponse.json({ ok: true, name: updated.name, locale: updated.locale, country: updated.country });
}


