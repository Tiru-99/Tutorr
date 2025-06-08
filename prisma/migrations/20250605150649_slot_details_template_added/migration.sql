-- DropForeignKey
ALTER TABLE "SlotDetails" DROP CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey";

-- AlterTable
ALTER TABLE "SlotDetails" ADD COLUMN     "teacherId" TEXT,
ALTER COLUMN "teacherAvailabilityId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE',
ALTER COLUMN "slotTime" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SlotDetails" ADD CONSTRAINT "SlotDetails_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotDetails" ADD CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey" FOREIGN KEY ("teacherAvailabilityId") REFERENCES "TeacherAvailability"("id") ON DELETE SET NULL ON UPDATE CASCADE;
