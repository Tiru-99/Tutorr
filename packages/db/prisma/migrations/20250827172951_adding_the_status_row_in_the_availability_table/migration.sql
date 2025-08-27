-- CreateEnum
CREATE TYPE "OverrideStatus" AS ENUM ('BOOKED', 'UNAVAILABLE', 'CANCELLED', 'AVAILABLE');

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "status" "OverrideStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropEnum
DROP TYPE "OverrideReason";
