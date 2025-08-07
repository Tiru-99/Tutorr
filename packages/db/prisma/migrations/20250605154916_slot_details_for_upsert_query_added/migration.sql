/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,slotTime]` on the table `SlotDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SlotDetails_teacherId_slotTime_key" ON "SlotDetails"("teacherId", "slotTime");
