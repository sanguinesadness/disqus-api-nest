import { User } from "@prisma/client";
import { Tokens } from "src/token/types/tokens";

export interface UserTokens {
  tokens: Tokens;
  user: User;
}
