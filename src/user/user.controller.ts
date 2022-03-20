import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  Request,
  Next,
} from "@nestjs/common";
import {
  NextFunction,
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import { REFRESH_EXPIRATION_TIME } from "src/constants/jwt-expiration";
import { LoginUserDto } from "./dto/login.dto";
import { RegisterUserDto } from "./dto/register.dto";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  private setRefreshTokenCookie(res: ResponseExpress, token: string) {
    res.cookie("refreshToken", token, {
      maxAge: REFRESH_EXPIRATION_TIME.num,
      httpOnly: true,
    });
  }

  @Get("/all")
  public async getAllUsers(
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const users = await this.userService.findAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  public async getWebsiteUsers(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const users = await this.userService.findByWebsiteId(
        req.cookies.websiteId,
      );
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  @Get("/activate/:link")
  public async activate(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const activationLink = req.params.link;
      await this.userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  @Post("/register")
  public async register(
    @Body() dto: RegisterUserDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const regResult = await this.userService.register(dto);
      this.setRefreshTokenCookie(res, regResult.tokens.refresh);

      return res.json(regResult);
    } catch (error) {
      next(error);
    }
  }

  @Post("/login")
  public async login(
    @Body() dto: LoginUserDto,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const logResult = await this.userService.login(dto);
      this.setRefreshTokenCookie(res, logResult.tokens.refresh);

      return res.json(logResult);
    } catch (error) {
      next(error);
    }
  }

  @Post("/logout")
  public async logout(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      const isSuccess = await this.userService.logout(refreshToken);

      res.clearCookie("refreshToken");

      if (isSuccess) return res.json(isSuccess);
      else return res.status(400).json(isSuccess);
    } catch (error) {
      next(error);
    }
  }

  @Post("/refresh")
  public async refresh(
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
    @Next() next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      const refreshResult = await this.userService.refresh(refreshToken);

      this.setRefreshTokenCookie(res, refreshResult.tokens.refresh);

      return res.json(refreshResult);
    } catch (error) {
      next(error);
    }
  }
}
