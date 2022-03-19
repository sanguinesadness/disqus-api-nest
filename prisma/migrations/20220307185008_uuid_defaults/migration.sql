-- CreateTable
CREATE TABLE "comment" (
    "id" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "discussionId" VARCHAR NOT NULL,
    "text" VARCHAR NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,

    CONSTRAINT "comment_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR,
    "websiteId" VARCHAR NOT NULL,

    CONSTRAINT "discussion_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "refreshToken" VARCHAR NOT NULL,

    CONSTRAINT "token_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "isActivated" BOOLEAN DEFAULT false,
    "activationLink" VARCHAR,

    CONSTRAINT "user_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website" (
    "id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "website_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_uindex" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "website_url_uindex" ON "website"("url");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_discussion_id_fk" FOREIGN KEY ("discussionId") REFERENCES "discussion"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_website_id_fk" FOREIGN KEY ("websiteId") REFERENCES "website"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
