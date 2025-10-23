-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoJobId" TEXT NOT NULL,
    "socialNetwork" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "customMessage" TEXT,
    CONSTRAINT "ScheduledPost_videoJobId_fkey" FOREIGN KEY ("videoJobId") REFERENCES "VideoJob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ScheduledPost_videoJobId_idx" ON "ScheduledPost"("videoJobId");

-- CreateIndex
CREATE INDEX "ScheduledPost_socialNetwork_idx" ON "ScheduledPost"("socialNetwork");

-- CreateIndex
CREATE INDEX "ScheduledPost_scheduledDate_idx" ON "ScheduledPost"("scheduledDate");
