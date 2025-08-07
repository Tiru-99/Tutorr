/*
  Warnings:

  - You are about to drop the column `available_from` on the `TeacherAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `available_to` on the `TeacherAvailability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeacherAvailability" DROP COLUMN "available_from",
DROP COLUMN "available_to",
ADD COLUMN     "available_days" TEXT[];
