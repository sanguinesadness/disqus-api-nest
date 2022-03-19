import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, Token, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  ACCESS_EXPIRATION_TIME,
  REFRESH_EXPIRATION_TIME,
} from "src/constants/jwt-expiration";
import { Tokens } from "./types/tokens";

@Injectable()
export class TokenService {
  private prisma = new PrismaClient();

  public async findByUser(userId: string): Promise<Token> {
    return await this.prisma.token.findFirst({ where: { userId } });
  }

  public async findByToken(refreshToken: string): Promise<Token> {
    return await this.prisma.token.findFirst({ where: { refreshToken } });
  }

  public async updateOne(
    id: string,
    data: Prisma.TokenUpdateInput,
  ): Promise<Token> {
    return await this.prisma.token.update({ where: { id }, data });
  }

  public async createOne(
    data: Prisma.TokenUncheckedCreateInput,
  ): Promise<Token> {
    return await this.prisma.token.create({ data });
  }

  public async deleteOne(id: string): Promise<Token> {
    return await this.prisma.token.delete({ where: { id } });
  }

  public async deleteMany(refreshToken: string): Promise<number> {
    const result = await this.prisma.token.deleteMany({
      where: { refreshToken },
    });
    return result.count;
  }

  public generateTokens(payload: User): Tokens {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: ACCESS_EXPIRATION_TIME.str,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: REFRESH_EXPIRATION_TIME.str,
    });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  public async saveToken(userId: string, refreshToken: string): Promise<Token> {
    const tokenFromDb = await this.findByUser(userId);

    if (tokenFromDb) {
      tokenFromDb.refreshToken = refreshToken;
      return await this.updateOne(tokenFromDb.id, tokenFromDb);
    }

    return await this.createOne({
      userId,
      refreshToken,
    });
  }

  public decode(token: string): User {
    return jwt.decode(token) as User;
  }

  public validateAccessToken(token: string): User | null {
    try {
      const data = jwt.verify(token, process.env.JWT_ACCESS_KEY) as User;
      return data;
    } catch {
      return null;
    }
  }

  public validateRefreshToken(token: string): User | null {
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_KEY) as User;
      return data;
    } catch {
      return null;
    }
  }
}
