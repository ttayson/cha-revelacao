-- CreateTable
CREATE TABLE "NameSuggestion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NameSuggestion_pkey" PRIMARY KEY ("id")
);
