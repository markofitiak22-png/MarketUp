-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'MOCK',
    "providerJobId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
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
    "publishAtTikTok" DATETIME,
    "publishAtInstagram" DATETIME,
    CONSTRAINT "VideoJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VideoJob" ("backgroundImageUrls", "contactAddress", "contactPhone", "createdAt", "id", "logoImageUrl", "productImageUrls", "provider", "providerJobId", "publishAtInstagram", "publishAtTikTok", "publishRegion", "script", "status", "updatedAt", "userId", "videoUrl") SELECT "backgroundImageUrls", "contactAddress", "contactPhone", "createdAt", "id", "logoImageUrl", "productImageUrls", "provider", "providerJobId", "publishAtInstagram", "publishAtTikTok", "publishRegion", "script", "status", "updatedAt", "userId", "videoUrl" FROM "VideoJob";
DROP TABLE "VideoJob";
ALTER TABLE "new_VideoJob" RENAME TO "VideoJob";
CREATE INDEX "VideoJob_userId_idx" ON "VideoJob"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
