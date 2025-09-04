/*
  Warnings:

  - You are about to alter the column `amount` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `amount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
