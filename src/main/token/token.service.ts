import { Injectable } from "@nestjs/common";
import { Website } from "@prisma/client";
import jwt from "jsonwebtoken";
import { WEBSITE_JWT_ACCESS_EXPIRATION_TIME } from "src/constants/jwt-expiration";

@Injectable()
export class TokenService {
  public generateToken(payload: Website): string {
    return jwt.sign(payload, process.env.WEBSITE_JWT_ACCESS_KEY, {
      expiresIn: WEBSITE_JWT_ACCESS_EXPIRATION_TIME.str,
    });
  }

  public decode(token: string): Website {
    return jwt.decode(token) as Website;
  }

  public validateAccessToken(token: string): Website | null {
    try {
      const data = jwt.verify(
        token,
        process.env.WEBSITE_JWT_ACCESS_KEY,
      ) as Website;
      return data;
    } catch {
      return null;
    }
  }
}
