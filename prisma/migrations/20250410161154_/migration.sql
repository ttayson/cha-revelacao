/*
  Warnings:

  - You are about to drop the `genger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "genger";

-- CreateTable
CREATE TABLE "gender" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "gender_pkey" PRIMARY KEY ("id")
);
