/*
  Warnings:

  - Added the required column `order_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_id` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "payment_id" TEXT NOT NULL;
