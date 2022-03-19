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

  @Get()
  public async getDiscussions(
    @Request() req: RequestExpress,
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

  @Post()
  public async create(
    @Body() dto: CreateDiscussionDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const discussion = await this.discussionService.createOne(dto);
      return res.json(discussion);
    } catch (error) {
      next(error);
    }
  }
}
