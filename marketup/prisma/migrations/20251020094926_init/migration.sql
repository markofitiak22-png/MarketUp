-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "phone" TEXT,
    "fingerprintHash" TEXT,
    "ipHash" TEXT
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "maxRewardsTotal" INTEGER,
    "dailyCap" INTEGER,
    CONSTRAINT "ReferralCode_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferralEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCodeId" TEXT NOT NULL,
    "referredFingerprintHash" TEXT,
    "referredIpHash" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rewardGranted" INTEGER NOT NULL DEFAULT 0,
    "reviewReason" TEXT,
    CONSTRAINT "ReferralEvent_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEvent_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ReferralEvent_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VideoJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'MOCK',
    "providerJobId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "videoUrl" TEXT,
    "script" TEXT NOT NULL,
    "backgroundImageUrls" JSONB NOT NULL,
    "productImageUrls" JSONB NOT NULL,
    "contactAddress" TEXT,
    "contactPhone" TEXT,
    "logoImageUrl" TEXT,
    CONSTRAINT "VideoJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_fingerprintHash_idx" ON "User"("fingerprintHash");

-- CreateIndex
CREATE INDEX "User_ipHash_idx" ON "User"("ipHash");

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
