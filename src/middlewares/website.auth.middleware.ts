import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "src/main/token/token.service";

@Injectable()
export class WebsiteAuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException();

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) throw new UnauthorizedException();

      const website = this.tokenService.validateAccessToken(accessToken);
      if (!website) throw new UnauthorizedException();

      req.body.websiteId = website.id;
      next();
    } catch (error) {
      next(error);
    }
  }
}
