-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'BOOST', 'PRO');

-- CreateEnum
CREATE TYPE "public"."EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "public"."JobApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "public"."JobPostingStatus" AS ENUM ('OPEN', 'CLOSED', 'FILLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "paymentReferenceId" TEXT,
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "platformFee" DOUBLE PRECISION,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "startProofGpsLat" DOUBLE PRECISION,
ADD COLUMN     "startProofGpsLng" DOUBLE PRECISION,
ADD COLUMN     "startProofPhoto" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "workerEarnings" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "registrationOrderId" TEXT,
ADD COLUMN     "registrationPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationPaidAt" TIMESTAMP(3),
ADD COLUMN     "registrationPaymentId" TEXT;

-- CreateTable
CREATE TABLE "public"."UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "public"."PlanType" NOT NULL DEFAULT 'FREE',
    "planExpiry" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsageTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "monthlyBookings" INTEGER NOT NULL DEFAULT 0,
    "monthlyLeads" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobApplication" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "jobPostingId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" "public"."JobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobPosting" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "employmentType" "public"."EmploymentType" NOT NULL,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "salaryMin" DOUBLE PRECISION,
    "salaryMax" DOUBLE PRECISION,
    "experienceRequired" INTEGER,
    "status" "public"."JobPostingStatus" NOT NULL DEFAULT 'OPEN',
    "employerId" TEXT NOT NULL,
    "selectedWorkerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TranslationCache" (
    "id" TEXT NOT NULL,
    "hashKey" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "sourceLanguage" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobLog" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "fromStatus" "public"."JobStatus",
    "toStatus" "public"."JobStatus" NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "public"."UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_planType_idx" ON "public"."UserSubscription"("userId", "planType");

-- CreateIndex
CREATE INDEX "UsageTracking_userId_year_month_idx" ON "public"."UsageTracking"("userId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "UsageTracking_userId_month_year_key" ON "public"."UsageTracking"("userId", "month", "year");

-- CreateIndex
CREATE INDEX "JobApplication_jobPostingId_status_idx" ON "public"."JobApplication"("jobPostingId", "status");

-- CreateIndex
CREATE INDEX "JobApplication_workerId_status_idx" ON "public"."JobApplication"("workerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobPostingId_workerId_key" ON "public"."JobApplication"("jobPostingId", "workerId");

-- CreateIndex
CREATE INDEX "JobPosting_employerId_status_idx" ON "public"."JobPosting"("employerId", "status");

-- CreateIndex
CREATE INDEX "JobPosting_latitude_longitude_idx" ON "public"."JobPosting"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "JobPosting_status_createdAt_idx" ON "public"."JobPosting"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationCache_hashKey_key" ON "public"."TranslationCache"("hashKey");

-- CreateIndex
CREATE INDEX "TranslationCache_hashKey_idx" ON "public"."TranslationCache"("hashKey");

-- CreateIndex
CREATE INDEX "TranslationCache_sourceLanguage_targetLanguage_idx" ON "public"."TranslationCache"("sourceLanguage", "targetLanguage");

-- CreateIndex
CREATE INDEX "JobLog_jobId_createdAt_idx" ON "public"."JobLog"("jobId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageTracking" ADD CONSTRAINT "UsageTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "public"."JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobPosting" ADD CONSTRAINT "JobPosting_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobPosting" ADD CONSTRAINT "JobPosting_selectedWorkerId_fkey" FOREIGN KEY ("selectedWorkerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobLog" ADD CONSTRAINT "JobLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
