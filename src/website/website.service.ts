import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, Website } from "@prisma/client";
import { CreateWebsiteDto } from "./dto/create.dto";

@Injectable()
export class WebsiteService {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Website[]> {
    return await this.prisma.website.findMany();
  }

  public async findByUrl(url: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { url } });
  }

  public async findByToken(token: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { token } });
  }

  public async createOne(dto: CreateWebsiteDto): Promise<Website> {
    const existingWebsite = this.findByUrl(dto.url);
    if (existingWebsite) throw new BadRequestException("Url is already taken");
    return await this.prisma.website.create({ data: dto });
  }
}
