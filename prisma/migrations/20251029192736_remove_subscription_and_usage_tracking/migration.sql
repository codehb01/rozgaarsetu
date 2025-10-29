/*
  Warnings:

  - You are about to drop the `UsageTracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UsageTracking" DROP CONSTRAINT "UsageTracking_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSubscription" DROP CONSTRAINT "UserSubscription_userId_fkey";

-- DropTable
DROP TABLE "public"."UsageTracking";

-- DropTable
DROP TABLE "public"."UserSubscription";

-- DropEnum
DROP TYPE "public"."PlanType";
