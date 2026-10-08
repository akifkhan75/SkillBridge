-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED');

-- AlterTable
ALTER TABLE "JobRequest" ADD COLUMN     "acceptedOfferId" TEXT,
ADD COLUMN     "agreedAmount" INTEGER,
ADD COLUMN     "agreedCurrency" TEXT,
ADD COLUMN     "bookedAt" TIMESTAMP(3),
ADD COLUMN     "lastMatchedAt" TIMESTAMP(3),
ADD COLUMN     "matchRound" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "JobMatch" (
    "id" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "declinedAt" TIMESTAMP(3),

    CONSTRAINT "JobMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "etaMinutes" INTEGER,
    "note" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobMatch_workerId_notifiedAt_idx" ON "JobMatch"("workerId", "notifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobMatch_jobRequestId_workerId_key" ON "JobMatch"("jobRequestId", "workerId");

-- CreateIndex
CREATE INDEX "Offer_jobRequestId_status_idx" ON "Offer"("jobRequestId", "status");

-- CreateIndex
CREATE INDEX "Offer_status_expiresAt_idx" ON "Offer"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_jobRequestId_workerId_key" ON "Offer"("jobRequestId", "workerId");

-- AddForeignKey
ALTER TABLE "JobMatch" ADD CONSTRAINT "JobMatch_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMatch" ADD CONSTRAINT "JobMatch_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Matching filters workers by base location; a plain btree on lat/lng lets the bounding-box
-- prefilter use an index (PostGIS can replace this when scale needs it, doc 05 §3).
CREATE INDEX "Worker_serviceLat_serviceLng_idx" ON "Worker"("serviceLat", "serviceLng") WHERE "activationStatus" = 'ACTIVE' AND "isOnline" = true;
-- Money and ETA sanity at the database level, not only in the API.
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_amount_positive" CHECK ("amount" > 0);
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_eta_range" CHECK ("etaMinutes" IS NULL OR "etaMinutes" BETWEEN 5 AND 2880);
