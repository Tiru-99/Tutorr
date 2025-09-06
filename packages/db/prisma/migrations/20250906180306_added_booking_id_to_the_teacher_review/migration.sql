/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `TeacherReview` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TeacherReview" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherReview_bookingId_key" ON "public"."TeacherReview"("bookingId");

-- AddForeignKey
ALTER TABLE "public"."TeacherReview" ADD CONSTRAINT "TeacherReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
