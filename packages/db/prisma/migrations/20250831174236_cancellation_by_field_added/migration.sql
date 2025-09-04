-- CreateEnum
CREATE TYPE "CancellationBy" AS ENUM ('TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancellationBy" "CancellationBy";
