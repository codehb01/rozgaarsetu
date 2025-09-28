/*
  Warnings:

  - You are about to drop the column `address` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `WorkerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `WorkerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `WorkerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CustomerProfile" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "formattedAddress" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "streetName" TEXT,
ADD COLUMN     "streetNumber" TEXT,
ADD COLUMN     "sublocality" TEXT;

-- AlterTable
ALTER TABLE "public"."WorkerProfile" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "formattedAddress" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "streetName" TEXT,
ADD COLUMN     "streetNumber" TEXT,
ADD COLUMN     "sublocality" TEXT;
