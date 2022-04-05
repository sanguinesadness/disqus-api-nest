/*
  Warnings:

  - Added the required column `text` to the `Discussion` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Discussion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "text" VARCHAR NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
