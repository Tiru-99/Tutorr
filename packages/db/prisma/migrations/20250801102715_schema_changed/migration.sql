/*
  Warnings:

  - A unique constraint covering the columns `[templateSlotId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_slotId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "templateSlotId" TEXT,
ALTER COLUMN "slotId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_templateSlotId_key" ON "Session"("templateSlotId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "SlotDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_templateSlotId_fkey" FOREIGN KEY ("templateSlotId") REFERENCES "TemplateSlots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
