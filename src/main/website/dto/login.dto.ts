import { Website } from "@prisma/client";

export type LoginWebsiteDto = Pick<Website, "email" | "password">;
