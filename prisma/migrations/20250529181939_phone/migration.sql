/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone_number" TEXT;
