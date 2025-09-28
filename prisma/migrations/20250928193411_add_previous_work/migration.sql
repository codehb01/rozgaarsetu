-- CreateTable
CREATE TABLE "public"."PreviousWork" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviousWork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PreviousWork" ADD CONSTRAINT "PreviousWork_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
