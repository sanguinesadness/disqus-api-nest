import { Discussion } from "@prisma/client";

export type CreateDiscussionDto = Pick<Discussion, "name" | "text">;
