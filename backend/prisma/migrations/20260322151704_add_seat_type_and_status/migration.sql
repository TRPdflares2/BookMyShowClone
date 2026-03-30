/*
  Warnings:

  - You are about to drop the column `isBooked` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `type` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'BOOKED');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('GOLD', 'SILVER', 'RECLINER');

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isBooked",
ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "type" "SeatType" NOT NULL;
