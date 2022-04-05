import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, Website } from "@prisma/client";
import { RegisterWebsiteDto } from "./dto/register.dto";
import { TokenService } from "../token/token.service";
import { MailService } from "src/mail/mail.service";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { WebsiteToken } from "./dto/websiteToken.dto";
import { LoginWebsiteDto } from "./dto/login.dto";

@Injectable()
export class WebsiteService {
  private prisma = new PrismaClient();

  constructor(
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  public async findAll(): Promise<Website[]> {
    return await this.prisma.website.findMany();
  }

  public async findByUrl(url: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { url } });
  }

  public async findById(id: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { id } });
  }

  public async findByEmail(email: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { email } });
  }

  public async findByToken(token: string): Promise<Website> {
    return this.prisma.website.findUnique({ where: { token } });
  }

  public async findByLink(activationLink: string): Promise<Website> {
    return await this.prisma.website.findFirst({ where: { activationLink } });
  }

  public async updateOne(id: string, data: Prisma.WebsiteUpdateInput) {
    return this.prisma.website.update({ where: { id }, data });
  }

  public async createOne(data: Prisma.WebsiteCreateInput) {
    return this.prisma.website.create({ data });
  }

  public async findToken(websiteId: string): Promise<string> {
    const website = await this.findById(websiteId);
    if (!website) throw new BadRequestException("No website found");

    return website.token;
  }

  public async register(dto: RegisterWebsiteDto): Promise<WebsiteToken> {
    const websiteFromDb = await this.findByEmail(dto.email);
    if (websiteFromDb) throw new BadRequestException("Email is already taken");

    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const activationLink = v4();

    const newWebsite = await this.createOne({
      name: dto.name,
      url: dto.url,
      email: dto.email,
      password: hashedPassword,
      isActivated: false,
      activationLink,
    });

    await this.mailService.sendActivationMail(
      newWebsite.email,
      `${process.env.API_URL}/website/activate/${activationLink}`,
    );

    const token = this.tokenService.generateToken(newWebsite);

    return {
      website: newWebsite,
      accessToken: token,
    };
  }

  public async login(dto: LoginWebsiteDto): Promise<WebsiteToken> {
    const website = await this.findByEmail(dto.email);
    if (!website) throw new BadRequestException("No website found");

    const isPassCorrect = await bcrypt.compare(dto.password, website.password);
    if (!isPassCorrect) throw new BadRequestException("Incorrent password");

    const accessToken = this.tokenService.generateToken(website);

    return {
      website,
      accessToken,
    };
  }

  public async activate(activationLink: string) {
    const websiteFromDb = await this.findByLink(activationLink);
    if (!websiteFromDb)
      throw new BadRequestException("Incorrect activation link");

    websiteFromDb.isActivated = true;
    await this.updateOne(websiteFromDb.id, websiteFromDb);
  }
}
