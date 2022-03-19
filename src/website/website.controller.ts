import { Controller, Get, Response, Next, Post, Body } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { Response as ResponseExpress, NextFunction } from "express";
import { CreateWebsiteDto } from "./dto/create.dto";

@Controller("/website")
export class WebsiteController {
  constructor(private websiteService: WebsiteService) {}

  @Get()
  public async getWebsites(
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const websites = await this.websiteService.findAll();
      return res.json(websites);
    } catch (error) {
      next(error);
    }
  }

  @Post()
  public async createWebsite(
    @Body() dto: CreateWebsiteDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const website = await this.websiteService.createOne(dto);
      return res.json(website);
    } catch (error) {
      next(error);
    }
  }
}
