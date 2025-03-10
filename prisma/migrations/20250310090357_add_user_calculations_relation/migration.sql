/*
  Warnings:

  - Added the required column `userId` to the `calculations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calculations" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "calculations" ADD CONSTRAINT "calculations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
