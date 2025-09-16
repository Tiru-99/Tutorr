/*
  Warnings:

  - You are about to drop the column `available_days` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `session_duration` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Teacher" DROP COLUMN "available_days",
DROP COLUMN "end_time",
DROP COLUMN "session_duration",
DROP COLUMN "start_time";
