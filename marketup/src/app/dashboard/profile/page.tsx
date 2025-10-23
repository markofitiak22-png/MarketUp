import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth");
  }

  // Get user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      locale: true,
      country: true,
    }
  });

  if (!user) {
    redirect("/auth");
  }

  console.log("ProfilePage - User data from DB:", user);

  return <ProfileClient initialData={user} />;
}
