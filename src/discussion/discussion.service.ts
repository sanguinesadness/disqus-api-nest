import { BadRequestException, Injectable } from "@nestjs/common";
import { Discussion, PrismaClient } from "@prisma/client";
import { CreateDiscussionDto } from "./dto/create.dto";

@Injectable()
export class DiscussionService {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Discussion[]> {
    return await this.prisma.discussion.findMany();
  }

  public async find(name: string, websiteId: string): Promise<Discussion> {
    return await this.prisma.discussion.findFirst({
      where: { name, websiteId },
    });
  }

  public async createOne(data: CreateDiscussionDto): Promise<Discussion> {
    const existingDiscussion = await this.find(data.name, data.websiteId);
    if (existingDiscussion)
      throw new BadRequestException("Name is already taken");
    return await this.prisma.discussion.create({ data });
  }
}
