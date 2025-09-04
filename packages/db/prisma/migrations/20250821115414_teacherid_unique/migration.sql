/*
  Warnings:

  - A unique constraint covering the columns `[teacherId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Schedule_teacherId_key" ON "Schedule"("teacherId");
