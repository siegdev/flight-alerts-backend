-- CreateTable
CREATE TABLE "FlightAlert" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightAlert_pkey" PRIMARY KEY ("id")
);
