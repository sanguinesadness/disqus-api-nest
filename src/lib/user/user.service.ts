import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { RegisterUserDto } from "./dto/register.dto";
import { LoginUserDto } from "./dto/login.dto";
import { TokenService } from "src/lib/token/token.service";
import { UserTokens } from "./dto/userTokens.dto";
import { MailService } from "src/mail/mail.service";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  constructor(
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  public async findById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  public async findByName(name: string): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { name } });
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  public async findByLink(activationLink: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { activationLink } });
  }

  public async findByWebsiteId(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { comment: { some: { discussion: { websiteId: id } } } },
    });
  }

  public async updateOne(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  public async createOne(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  public async register(dto: RegisterUserDto): Promise<UserTokens> {
    const userFromDb = await this.findByEmail(dto.email);
    if (userFromDb) throw new BadRequestException("Email is already taken");

    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const activationLink = v4();

    const newUser = await this.createOne({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isActivated: false,
      activationLink,
    });

    await this.mailService.sendActivationMail(
      newUser.email,
      `${process.env.API_URL}/user/activate/${activationLink}`,
    );

    const tokens = this.tokenService.generateTokens(newUser);
    await this.tokenService.saveToken(newUser.id, tokens.refresh);

    return {
      tokens,
      user: newUser,
    };
  }

  public async login(dto: LoginUserDto): Promise<UserTokens> {
    const user = await this.findByEmail(dto.email);
    if (!user) throw new BadRequestException("No user found");

    const isPassCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPassCorrect) throw new BadRequestException("Password is incorrect");

    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refresh);

    return {
      tokens,
      user,
    };
  }

  public async activate(activationLink: string) {
    const userFromDb = await this.findByLink(activationLink);
    if (!userFromDb) throw new BadRequestException("Incorrect activation link");

    userFromDb.isActivated = true;
    await this.updateOne(userFromDb.id, userFromDb);
  }

  public async logout(refreshToken: string): Promise<boolean> {
    const deletedCount = await this.tokenService.deleteMany(refreshToken);
    return deletedCount > 0;
  }

  public async refresh(refreshToken: string): Promise<UserTokens> {
    if (!refreshToken) throw new UnauthorizedException();

    const userId = this.tokenService.validateRefreshToken(refreshToken).id;
    const user = await this.findById(userId);

    if (!user) throw new BadRequestException("User not found");

    const tokenFromDb = await this.tokenService.findByToken(refreshToken);

    if (!tokenFromDb || user.id !== tokenFromDb.userId)
      throw new UnauthorizedException();

    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refresh);

    return {
      tokens,
      user,
    };
  }
}
