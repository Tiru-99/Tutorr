/*
  Warnings:

  - You are about to drop the column `status` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "status",
ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true;
