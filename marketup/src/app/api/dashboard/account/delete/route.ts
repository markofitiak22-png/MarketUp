import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/dashboard/account/delete - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user account and all related data
    // Using transaction to ensure all deletions succeed or none
    await prisma.$transaction(async (tx) => {
      // Delete related data manually to ensure everything is removed
      // Note: Some relations have onDelete: Cascade, but we'll be explicit
      
      // Delete referral codes owned by user
      await tx.referralCode.deleteMany({
        where: { ownerId: userId }
      });

      // Delete referral events where user is referrer or referred
      await tx.referralEvent.deleteMany({
        where: {
          OR: [
            { referrerId: userId },
            { referredUserId: userId }
          ]
        }
      });

      // Delete subscriptions
      await tx.subscription.deleteMany({
        where: { userId }
      });

      // Delete manual payments
      await tx.manualPayment.deleteMany({
        where: { userId }
      });

      // Delete contact messages
      await tx.contactMessage.deleteMany({
        where: { userId }
      });

      // Delete reviews
      await tx.review.deleteMany({
        where: { userId }
      });

      // Delete videos
      await tx.video.deleteMany({
        where: { userId }
      });

      // Delete video jobs
      await tx.videoJob.deleteMany({
        where: { userId }
      });

      // Delete Syriatel transactions
      await tx.syriatelTransaction.deleteMany({
        where: { userId }
      });

      // Delete accounts (NextAuth)
      await tx.account.deleteMany({
        where: { userId }
      });

      // Delete sessions (NextAuth)
      await tx.session.deleteMany({
        where: { userId }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

