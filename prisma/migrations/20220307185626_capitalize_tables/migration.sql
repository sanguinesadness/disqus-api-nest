/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `website` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_discussion_id_fk";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fk";

-- DropForeignKey
ALTER TABLE "discussion" DROP CONSTRAINT "discussion_website_id_fk";

-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_user_id_fk";

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "discussion";

-- DropTable
DROP TABLE "token";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "website";

-- CreateTable
CREATE TABLE "Comment" (
    "id" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "discussionId" VARCHAR NOT NULL,
    "text" VARCHAR NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,

    CONSTRAINT "comment_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR,
    "websiteId" VARCHAR NOT NULL,

    CONSTRAINT "discussion_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "refreshToken" VARCHAR NOT NULL,

    CONSTRAINT "token_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "isActivated" BOOLEAN DEFAULT false,
    "activationLink" VARCHAR,

    CONSTRAINT "user_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "website_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_uindex" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "website_url_uindex" ON "Website"("url");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "comment_discussion_id_fk" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "comment_user_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "discussion_website_id_fk" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "token_user_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
