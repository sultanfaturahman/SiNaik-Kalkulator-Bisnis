/*
  Warnings:

  - Added the required column `businessAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessAddress" TEXT NOT NULL,
ADD COLUMN     "businessName" TEXT NOT NULL;
