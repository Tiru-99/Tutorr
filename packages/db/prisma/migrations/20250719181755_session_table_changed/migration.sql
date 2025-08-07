/*
  Warnings:

  - Added the required column `booking_status` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_SUCCESS', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "booking_status" "BookingStatus" NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL,
ALTER COLUMN "payment_id" DROP NOT NULL;
