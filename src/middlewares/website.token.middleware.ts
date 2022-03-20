import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WebsiteService } from "src/main/website/website.service";

@Injectable()
export class WebsiteTokenMiddleware implements NestMiddleware {
  constructor(private websiteService: WebsiteService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies.websiteToken)
        throw new BadRequestException("Website Token was not provided");
      const { websiteToken } = req.cookies;

      const website = await this.websiteService.findByToken(websiteToken);
      if (!website) throw new UnauthorizedException();

      req.cookies.websiteId = website.id;
      next();
    } catch (error) {
      next(error);
    }
  }
}
