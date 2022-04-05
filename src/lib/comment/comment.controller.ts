import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Post,
  Response,
  Request,
} from "@nestjs/common";
import {
  NextFunction,
  Response as ResponseExpress,
  Request as RequestExpress,
} from "express";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create.dto";
import { DeleteCommentDto } from "./dto/delete.dto";

@Controller("comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get("/all")
  public async getAllComments(
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const comments = await this.commentService.findAll();
      return res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  public async getWebsiteComments(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const comments = await this.commentService.findByWebsiteId(
        req.cookies.websiteId,
      );
      return res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  @Post()
  public async create(
    @Body() dto: CreateCommentDto & { websiteId: string },
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const comment = await this.commentService.createOne(dto);
      return res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  @Post("/like")
  public async like(
    @Body() body: { commentId: string },
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const likes = await this.commentService.like(body.commentId);
      return res.json(likes);
    } catch (error) {
      next(error);
    }
  }

  @Post("/dislike")
  public async dislike(
    @Body() body: { commentId: string },
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const dislikes = await this.commentService.dislike(body.commentId);
      return res.json(dislikes);
    } catch (error) {
      next(error);
    }
  }

  @Delete()
  public async delete(
    @Body() dto: DeleteCommentDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const deletedComment = await this.commentService.deleteOne(dto.id);
      return res.json(deletedComment);
    } catch (error) {
      next(error);
    }
  }
}
