import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Post,
  Response,
} from "@nestjs/common";
import { NextFunction, Response as ResponseExpress } from "express";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create.dto";
import { DeleteCommentDto } from "./dto/delete.dto";

@Controller("comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  public async getComments(
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

  @Post()
  public async create(
    @Body() dto: CreateCommentDto,
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
