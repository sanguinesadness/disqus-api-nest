import { Comment } from "@prisma/client";

export type CreateCommentDto = Pick<
  Comment,
  "userId" | "discussionId" | "text"
>;
