import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient, Comment } from "@prisma/client";
import { CreateCommentDto } from "./dto/create.dto";

@Injectable()
export class CommentService {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Comment[]> {
    return await this.prisma.comment.findMany();
  }

  public async findById(id: string): Promise<Comment> {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  public async createOne(data: CreateCommentDto): Promise<Comment> {
    return await this.prisma.comment.create({ data });
  }

  public async deleteOne(id: string): Promise<Comment> {
    const existingComment = await this.findById(id);
    if (!existingComment)
      throw new BadRequestException("Requested comment does not exist");
    return await this.prisma.comment.delete({ where: { id } });
  }
}
