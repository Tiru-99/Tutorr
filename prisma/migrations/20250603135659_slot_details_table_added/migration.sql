/*
  Warnings:

  - You are about to drop the column `available_days` on the `TeacherAvailability` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('BOOKED', 'AVAILABLE', 'CANCELLED');

-- AlterTable
ALTER TABLE "TeacherAvailability" DROP COLUMN "available_days";

-- CreateTable
CREATE TABLE "SlotDetails" (
    "id" TEXT NOT NULL,
    "teacherAvailabilityId" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "sessionId" TEXT,

    CONSTRAINT "SlotDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlotDetails_sessionId_key" ON "SlotDetails"("sessionId");

-- AddForeignKey
ALTER TABLE "SlotDetails" ADD CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey" FOREIGN KEY ("teacherAvailabilityId") REFERENCES "TeacherAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotDetails" ADD CONSTRAINT "SlotDetails_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
