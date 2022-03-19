import { Website } from "@prisma/client";

export type CreateWebsiteDto = Pick<Website, "name" | "url">;
