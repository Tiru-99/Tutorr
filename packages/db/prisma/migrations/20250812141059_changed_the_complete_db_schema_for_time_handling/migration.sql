/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlotDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherAvailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TemplateSlots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_slotId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_templateSlotId_fkey";

-- DropForeignKey
ALTER TABLE "SlotDetails" DROP CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey";

-- DropForeignKey
ALTER TABLE "SlotDetails" DROP CONSTRAINT "SlotDetails_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAvailability" DROP CONSTRAINT "TeacherAvailability_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateSlots" DROP CONSTRAINT "TemplateSlots_teacherId_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SlotDetails";

-- DropTable
DROP TABLE "TeacherAvailability";

-- DropTable
DROP TABLE "TemplateSlots";

-- DropEnum
DROP TYPE "SessionStatus";

-- DropEnum
DROP TYPE "StatusType";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "scheduleId" TEXT,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "meeting_url" TEXT,
    "payment_id" TEXT,
    "order_id" TEXT,
    "status" "BookingStatus" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
