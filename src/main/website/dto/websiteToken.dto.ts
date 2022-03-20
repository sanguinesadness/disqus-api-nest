import { Website } from "@prisma/client";

export interface WebsiteToken {
  website: Website;
  accessToken: string;
}