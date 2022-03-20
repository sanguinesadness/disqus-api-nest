import { User } from "@prisma/client";
import { Tokens } from "src/lib/token/types/tokens";

export interface UserTokens {
  tokens: Tokens;
  user: User;
}
