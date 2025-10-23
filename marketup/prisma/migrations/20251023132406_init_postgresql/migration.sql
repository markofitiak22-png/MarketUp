-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VideoJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('MOCK');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "name" TEXT,
    "locale" TEXT,
    "country" TEXT,
    "fingerprintHash" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "note" TEXT,
    "receiptUrl" TEXT,

    CONSTRAINT "ManualPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT NOT NULL DEFAULT 'GENERAL',

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tier" "PlanTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "rememberMe" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "maxRewardsTotal" INTEGER,
    "dailyCap" INTEGER,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCodeId" TEXT NOT NULL,
    "referredFingerprintHash" TEXT,
    "referredIpHash" TEXT,
    "userAgent" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "rewardGranted" INTEGER NOT NULL DEFAULT 0,
    "reviewReason" TEXT,

    CONSTRAINT "ReferralEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "provider" "VideoProvider" NOT NULL DEFAULT 'MOCK',
    "providerJobId" TEXT,
    "status" "VideoJobStatus" NOT NULL DEFAULT 'QUEUED',
    "videoUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "thumbnailUrl" TEXT,
    "fileSize" INTEGER,
    "resolution" TEXT,
    "format" TEXT,
    "quality" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "script" TEXT NOT NULL,
    "backgroundImageUrls" JSONB NOT NULL,
    "productImageUrls" JSONB NOT NULL,
    "contactAddress" TEXT,
    "contactPhone" TEXT,
    "logoImageUrl" TEXT,
    "publishRegion" TEXT,
    "publishAtTikTok" TIMESTAMP(3),
    "publishAtInstagram" TIMESTAMP(3),

    CONSTRAINT "VideoJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoJobId" TEXT NOT NULL,
    "socialNetwork" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "customMessage" TEXT,

    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_fingerprintHash_idx" ON "User"("fingerprintHash");

-- CreateIndex
CREATE INDEX "User_ipHash_idx" ON "User"("ipHash");

-- CreateIndex
CREATE INDEX "ManualPayment_userId_idx" ON "ManualPayment"("userId");

-- CreateIndex
CREATE INDEX "ContactMessage_userId_idx" ON "ContactMessage"("userId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_priority_idx" ON "ContactMessage"("priority");

-- CreateIndex
CREATE INDEX "ContactMessage_category_idx" ON "ContactMessage"("category");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE INDEX "ReferralCode_ownerId_idx" ON "ReferralCode"("ownerId");

-- CreateIndex
CREATE INDEX "ReferralEvent_referrerId_idx" ON "ReferralEvent"("referrerId");

-- CreateIndex
CREATE INDEX "ReferralEvent_referralCodeId_idx" ON "ReferralEvent"("referralCodeId");

-- CreateIndex
CREATE INDEX "ReferralEvent_referredFingerprintHash_idx" ON "ReferralEvent"("referredFingerprintHash");

-- CreateIndex
CREATE INDEX "ReferralEvent_referredIpHash_idx" ON "ReferralEvent"("referredIpHash");

-- CreateIndex
CREATE INDEX "VideoJob_userId_idx" ON "VideoJob"("userId");

-- CreateIndex
CREATE INDEX "ScheduledPost_videoJobId_idx" ON "ScheduledPost"("videoJobId");

-- CreateIndex
CREATE INDEX "ScheduledPost_socialNetwork_idx" ON "ScheduledPost"("socialNetwork");

-- CreateIndex
CREATE INDEX "ScheduledPost_scheduledDate_idx" ON "ScheduledPost"("scheduledDate");

-- AddForeignKey
ALTER TABLE "ManualPayment" ADD CONSTRAINT "ManualPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralEvent" ADD CONSTRAINT "ReferralEvent_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralEvent" ADD CONSTRAINT "ReferralEvent_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralEvent" ADD CONSTRAINT "ReferralEvent_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoJob" ADD CONSTRAINT "VideoJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPost" ADD CONSTRAINT "ScheduledPost_videoJobId_fkey" FOREIGN KEY ("videoJobId") REFERENCES "VideoJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
