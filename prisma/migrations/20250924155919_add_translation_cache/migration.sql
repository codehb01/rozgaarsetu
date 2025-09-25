/*
  Warnings:

  - You are about to drop the `Translation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TranslationUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Translation";

-- DropTable
DROP TABLE "public"."TranslationUsage";

-- CreateTable
CREATE TABLE "public"."TranslationCache" (
    "id" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "sourceLanguage" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT,
    "hashKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TranslationCache_hashKey_key" ON "public"."TranslationCache"("hashKey");

-- CreateIndex
CREATE INDEX "TranslationCache_hashKey_idx" ON "public"."TranslationCache"("hashKey");

-- CreateIndex
CREATE INDEX "TranslationCache_contentType_contentId_idx" ON "public"."TranslationCache"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "TranslationCache_sourceLanguage_targetLanguage_idx" ON "public"."TranslationCache"("sourceLanguage", "targetLanguage");
