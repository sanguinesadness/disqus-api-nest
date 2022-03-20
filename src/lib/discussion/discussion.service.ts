import { BadRequestException, Injectable } from "@nestjs/common";
import { Discussion, PrismaClient } from "@prisma/client";

@Injectable()
export class DiscussionService {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Discussion[]> {
    return await this.prisma.discussion.findMany();
  }

  public async findByWebsiteId(id: string): Promise<Discussion[]> {
    return await this.prisma.discussion.findMany({ where: { websiteId: id } });
  }

  public async find(name: string, websiteId: string): Promise<Discussion> {
    return await this.prisma.discussion.findFirst({
      where: { name, websiteId },
    });
  }

  public async createOne(name: string, websiteId: string): Promise<Discussion> {
    const existingDiscussion = await this.find(name, websiteId);
    if (existingDiscussion)
      throw new BadRequestException("Name is already taken");
    return await this.prisma.discussion.create({ data: { name, websiteId } });
  }
}
