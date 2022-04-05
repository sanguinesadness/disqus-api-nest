import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient, Comment, Prisma } from "@prisma/client";
import { CreateCommentDto } from "./dto/create.dto";

@Injectable()
export class CommentService {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Comment[]> {
    return await this.prisma.comment.findMany({ include: { user: true } });
  }

  public async findByWebsiteId(id: string): Promise<Comment[]> {
    return await this.prisma.comment.findMany({
      where: { discussion: { websiteId: id } },
      include: { user: true },
    });
  }

  public async findById(id: string): Promise<Comment> {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  public async createOne(
    data: Prisma.CommentUncheckedCreateInput,
  ): Promise<Comment> {
    return await this.prisma.comment.create({ data });
  }

  public async deleteOne(id: string): Promise<Comment> {
    const existingComment = await this.findById(id);
    if (!existingComment)
      throw new BadRequestException("Requested comment does not exist");
    return await this.prisma.comment.delete({ where: { id } });
  }

  public async like(id: string): Promise<number> {
    const existingComment = await this.findById(id);
    if (!existingComment)
      throw new BadRequestException("Requested comment does not exist");

    const comment = await this.prisma.comment.update({
      where: { id },
      data: { ...existingComment, likes: existingComment.likes + 1 },
    });

    return comment.likes;
  }

  public async dislike(id: string): Promise<number> {
    const existingComment = await this.findById(id);
    if (!existingComment)
      throw new BadRequestException("Requested comment does not exist");

    const comment = await this.prisma.comment.update({
      where: { id },
      data: { ...existingComment, dislikes: existingComment.dislikes + 1 },
    });

    return comment.dislikes;
  }
}
