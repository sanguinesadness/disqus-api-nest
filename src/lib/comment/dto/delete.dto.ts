import { Comment } from "@prisma/client";

export type DeleteCommentDto = Pick<Comment, "userId" | "id">;
