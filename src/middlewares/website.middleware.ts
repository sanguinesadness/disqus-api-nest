import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WebsiteService } from "src/website/website.service";

@Injectable()
export class WebsiteMiddleware implements NestMiddleware {
  constructor(private websiteService: WebsiteService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies.token)
        throw new BadRequestException("Website Token was not provided");
      const { token } = req.cookies;

      const website = await this.websiteService.findByToken(token);
      if (!website) throw new UnauthorizedException();

      req.body.websiteId = website.id;
      next();
    } catch (error) {
      next(error);
    }
  }
}
