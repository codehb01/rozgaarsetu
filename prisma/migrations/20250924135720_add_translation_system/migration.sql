-- CreateTable
CREATE TABLE "public"."Translation" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TranslationUsage" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT NOT NULL,
    "characterCount" INTEGER NOT NULL,
    "apiCalls" INTEGER NOT NULL DEFAULT 1,
    "cost" DOUBLE PRECISION,

    CONSTRAINT "TranslationUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Translation_contentType_contentId_idx" ON "public"."Translation"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_contentType_contentId_language_key" ON "public"."Translation"("contentType", "contentId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationUsage_date_language_key" ON "public"."TranslationUsage"("date", "language");
