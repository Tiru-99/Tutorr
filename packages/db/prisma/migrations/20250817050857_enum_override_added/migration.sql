-- CreateEnum
CREATE TYPE "OverrideReason" AS ENUM ('BOOKED', 'UNAVAILABLE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "reason" "OverrideReason";
