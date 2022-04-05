import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Request,
  Response,
} from "@nestjs/common";
import {
  NextFunction,
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import { DiscussionService } from "./discussion.service";
import { CreateDiscussionDto } from "./dto/create.dto";

@Controller("discussion")
export class DiscussionController {
  constructor(private discussionService: DiscussionService) {}

  @Get("/all")
  public async getAllDiscussions(
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const discussions = await this.discussionService.findAll();
      return res.json(discussions);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  public async getWebsiteDiscussions(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const discussions = await this.discussionService.findByWebsiteId(
        req.cookies.websiteId,
      );
      return res.json(discussions);
    } catch (error) {
      next(error);
    }
  }

  @Post()
  public async create(
    @Body() dto: CreateDiscussionDto,
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const discussion = await this.discussionService.createOne(
        dto.name,
        dto.text,
        req.cookies.websiteId,
      );
      return res.json(discussion);
    } catch (error) {
      next(error);
    }
  }
}
