/*
  Warnings:

  - You are about to drop the column `end_time` on the `SlotDetails` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `SlotDetails` table. All the data in the column will be lost.
  - Added the required column `slotTime` to the `SlotDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlotDetails" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "slotTime" TEXT NOT NULL;
