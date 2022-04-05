/*
  Warnings:

  - Added the required column `websiteId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "websiteId" VARCHAR NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
