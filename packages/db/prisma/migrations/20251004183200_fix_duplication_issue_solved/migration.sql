/*
  Warnings:

  - The `average_rating` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Teacher" DROP COLUMN "average_rating",
ADD COLUMN     "average_rating" INTEGER;
