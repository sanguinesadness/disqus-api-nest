import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException();

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) throw new UnauthorizedException();

      const user = this.tokenService.validateAccessToken(accessToken);
      if (!user) throw new UnauthorizedException();

      req.body.userId = user.id;
      next();
    } catch (error) {
      next(error);
    }
  }
}
