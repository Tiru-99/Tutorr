-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
