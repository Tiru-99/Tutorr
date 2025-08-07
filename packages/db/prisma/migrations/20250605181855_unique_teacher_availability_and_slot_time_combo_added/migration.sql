/*
  Warnings:

  - A unique constraint covering the columns `[teacherAvailabilityId,slotTime]` on the table `SlotDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SlotDetails_teacherAvailabilityId_slotTime_key" ON "SlotDetails"("teacherAvailabilityId", "slotTime");
