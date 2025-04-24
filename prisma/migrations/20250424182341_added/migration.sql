/*
  Warnings:

  - Added the required column `banner_pic` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner_pic` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "banner_pic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "banner_pic" TEXT NOT NULL;
