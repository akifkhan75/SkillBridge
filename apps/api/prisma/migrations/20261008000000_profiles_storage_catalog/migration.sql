-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FIXED', 'HOURLY', 'CALLOUT_PLUS_QUOTE', 'QUOTE');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('ID', 'SELFIE', 'TRADE_LICENSE', 'INSURANCE');

-- CreateEnum
CREATE TYPE "VerificationCaseStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'NEEDS_INFO');

-- CreateEnum
CREATE TYPE "UploadPurpose" AS ENUM ('AVATAR', 'VERIFICATION', 'PORTFOLIO');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'READY', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.



-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "area" TEXT,
ADD COLUMN     "buildingDetail" TEXT,
ADD COLUMN     "landmark" TEXT,
ALTER COLUMN "postalCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "availability",
DROP COLUMN "backgroundCheckStatus",
DROP COLUMN "homeAddress",
DROP COLUMN "hourlyRateRange",
DROP COLUMN "idVerifiedStatus",
DROP COLUMN "isLicenseVerified",
DROP COLUMN "licenseDetails",
DROP COLUMN "referencesStatus",
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "hidePhotoUntilBooked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hourlyRate" INTEGER,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "pricingModel" "PricingModel",
ADD COLUMN     "serviceAreaLabel" TEXT,
ADD COLUMN     "serviceLat" DOUBLE PRECISION,
ADD COLUMN     "serviceLng" DOUBLE PRECISION,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Karachi',
ALTER COLUMN "serviceRadius" SET DEFAULT 10,
ALTER COLUMN "currency" SET DEFAULT 'PKR',
ALTER COLUMN "activationStatus" SET DEFAULT 'ONBOARDING';

-- DropEnum
DROP TYPE "VerificationStatus";

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "photoKeys" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCase" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "status" "VerificationCaseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "documentKeys" TEXT[],
    "reference" TEXT,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "purpose" "UploadPurpose" NOT NULL,
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readyAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceIssue" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translations" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_workerId_weekday_key" ON "WorkingHours"("workerId", "weekday");

-- CreateIndex
CREATE INDEX "PortfolioItem_workerId_idx" ON "PortfolioItem"("workerId");

-- CreateIndex
CREATE INDEX "VerificationCase_workerId_type_idx" ON "VerificationCase"("workerId", "type");

-- CreateIndex
CREATE INDEX "VerificationCase_status_createdAt_idx" ON "VerificationCase"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Upload_key_key" ON "Upload"("key");

-- CreateIndex
CREATE INDEX "Upload_ownerId_status_idx" ON "Upload"("ownerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceIssue_categoryId_code_key" ON "ServiceIssue"("categoryId", "code");

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceIssue" ADD CONSTRAINT "ServiceIssue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

