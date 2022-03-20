/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Website` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Website` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "activationLink" VARCHAR,
ADD COLUMN     "email" VARCHAR NOT NULL,
ADD COLUMN     "isActivated" BOOLEAN DEFAULT false,
ADD COLUMN     "password" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "website_email_uindex" ON "Website"("email");
