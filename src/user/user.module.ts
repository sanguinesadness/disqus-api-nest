import { Module } from "@nestjs/common";
import { MailService } from "src/mail/mail.service";
import { TokenService } from "src/token/token.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, TokenService, MailService],
})
export class UserModule {}
