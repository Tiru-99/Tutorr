/*
  Warnings:

  - You are about to drop the column `time_of_meeting` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `SlotDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slotId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SlotDetails" DROP CONSTRAINT "SlotDetails_sessionId_fkey";

-- DropIndex
DROP INDEX "SlotDetails_sessionId_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "time_of_meeting",
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SlotDetails" DROP COLUMN "sessionId";

-- CreateIndex
CREATE UNIQUE INDEX "Session_slotId_key" ON "Session"("slotId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "SlotDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
