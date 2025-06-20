/*
  Warnings:

  - A unique constraint covering the columns `[email,origin,destination,maxPrice,departureDate]` on the table `FlightAlert` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlightAlert_email_origin_destination_maxPrice_departureDate_key" ON "FlightAlert"("email", "origin", "destination", "maxPrice", "departureDate");
