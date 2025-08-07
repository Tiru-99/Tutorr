-- DropForeignKey
ALTER TABLE "SlotDetails" DROP CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey";

-- AddForeignKey
ALTER TABLE "SlotDetails" ADD CONSTRAINT "SlotDetails_teacherAvailabilityId_fkey" FOREIGN KEY ("teacherAvailabilityId") REFERENCES "TeacherAvailability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
