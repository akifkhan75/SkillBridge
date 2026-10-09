-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('PHOTO', 'AUDIO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UploadPurpose" ADD VALUE 'JOB_PHOTO';
ALTER TYPE "UploadPurpose" ADD VALUE 'JOB_AUDIO';

-- AlterTable
ALTER TABLE "JobRequest" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "area" TEXT,
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledById" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "issueCodes" TEXT[],
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "scheduledFrom" TIMESTAMP(3),
ADD COLUMN     "scheduledTo" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ADD COLUMN     "whenOption" TEXT;

-- CreateTable
CREATE TABLE "JobMedia" (
    "id" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "transcript" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEvent" (
    "id" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAiAnalysis" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "jobRequestId" TEXT,
    "kind" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "output" JSONB,
    "valid" BOOLEAN NOT NULL,
    "error" TEXT,
    "latencyMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobAiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobMedia_jobRequestId_idx" ON "JobMedia"("jobRequestId");

-- CreateIndex
CREATE INDEX "JobEvent_jobRequestId_createdAt_idx" ON "JobEvent"("jobRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "JobAiAnalysis_ownerId_createdAt_idx" ON "JobAiAnalysis"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "JobRequest_status_categoryId_idx" ON "JobRequest"("status", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "JobRequest_customerId_idempotencyKey_key" ON "JobRequest"("customerId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMedia" ADD CONSTRAINT "JobMedia_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAiAnalysis" ADD CONSTRAINT "JobAiAnalysis_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

