import { User } from "@prisma/client";

export type RegisterUserDto = Pick<User, "email" | "password" | "name">;
