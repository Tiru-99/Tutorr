/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,date]` on the table `TeacherAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeacherAvailability_teacherId_date_key" ON "TeacherAvailability"("teacherId", "date");
