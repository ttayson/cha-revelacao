-- CreateTable
CREATE TABLE "genger" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "genger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guess" (
    "id" SERIAL NOT NULL,
    "guess" TEXT NOT NULL,

    CONSTRAINT "guess_pkey" PRIMARY KEY ("id")
);
