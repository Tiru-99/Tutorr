/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "phoneNumber";
