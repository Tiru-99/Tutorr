/*
  Warnings:

  - Added the required column `currency` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR');

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "currency" "Currency" NOT NULL;
