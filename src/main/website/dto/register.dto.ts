import { Website } from "@prisma/client";

export type RegisterWebsiteDto = Pick<
  Website,
  "name" | "email" | "password" | "url"
>;
