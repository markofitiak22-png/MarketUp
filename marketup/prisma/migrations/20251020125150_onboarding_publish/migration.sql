-- AlterTable
ALTER TABLE "User" ADD COLUMN "country" TEXT;

-- AlterTable
ALTER TABLE "VideoJob" ADD COLUMN "publishAtInstagram" DATETIME;
ALTER TABLE "VideoJob" ADD COLUMN "publishAtTikTok" DATETIME;
ALTER TABLE "VideoJob" ADD COLUMN "publishRegion" TEXT;
