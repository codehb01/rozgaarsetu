/*
  Warnings:

  - You are about to drop the column `registrationOrderId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationPaid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationPaidAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationPaymentId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "registrationOrderId",
DROP COLUMN "registrationPaid",
DROP COLUMN "registrationPaidAt",
DROP COLUMN "registrationPaymentId";
