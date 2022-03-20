import { User } from "@prisma/client";

export type LoginUserDto = Pick<User, "email" | "password">;
