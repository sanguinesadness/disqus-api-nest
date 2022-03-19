/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "website_token_uindex" ON "Website"("token");
