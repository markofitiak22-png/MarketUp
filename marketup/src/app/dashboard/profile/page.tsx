import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!(session as any)?.user?.email) {
    redirect("/auth");
  }

  // Get user data from database
  const user = await prisma.user.findUnique({
    where: { email: (session as any).user.email },
    select: {
      name: true,
      email: true,
      locale: true,
      country: true,
      createdAt: true,
    }
  });

  // Get user statistics
  const userId = (session as any).user.id;
  
  // Get video count
  const videoCount = await prisma.video.count({
    where: { userId: userId }
  });

  // Get video jobs count
  const videoJobsCount = await prisma.videoJob.count({
    where: { userId: userId }
  });

  // Get referral statistics
  const referralStats = await prisma.referralEvent.findMany({
    where: { referrerId: userId },
    select: { status: true }
  });

  const approvedReferrals = referralStats.filter(r => r.status === "APPROVED").length;
  const totalReferrals = referralStats.length;

  // Calculate profile completion percentage
  const profileFields = [
    user?.name,
    user?.country,
    user?.locale,
  ];
  const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const userStats = {
    videoCount,
    videoJobsCount,
    approvedReferrals,
    totalReferrals,
    profileCompletion,
    memberSince: user?.createdAt
  };

  if (!user) {
    redirect("/auth");
  }

  console.log("ProfilePage - User data from DB:", user);
  console.log("ProfilePage - User stats:", userStats);

  return <ProfileClient initialData={user} userStats={userStats} />;
}
