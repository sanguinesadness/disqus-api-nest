import {
  Controller,
  Get,
  Response,
  Next,
  Post,
  Body,
  Request,
} from "@nestjs/common";
import { WebsiteService } from "./website.service";
import {
  NextFunction,
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import { RegisterWebsiteDto } from "./dto/register.dto";
import { LoginWebsiteDto } from "./dto/login.dto";

@Controller("website")
export class WebsiteController {
  constructor(private websiteService: WebsiteService) {}

  @Get()
  public async getAllWebsites(
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const users = await this.websiteService.findAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  @Get("/activate/:link")
  public async activate(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const activationLink = req.params.link;
      await this.websiteService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  @Post("/register")
  public async register(
    @Body() dto: RegisterWebsiteDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {      
      const regResult = await this.websiteService.register(dto);
      return res.json(regResult);
    } catch (error) {
      next(error);
    }
  }

  @Post("/login")
  public async login(
    @Body() dto: LoginWebsiteDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const logResult = await this.websiteService.login(dto);
      return res.json(logResult);
    } catch (error) {
      next(error);
    }
  }
}
