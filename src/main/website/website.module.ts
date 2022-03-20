import { Module } from "@nestjs/common";
import { MailService } from "src/mail/mail.service";
import { TokenService } from "../token/token.service";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "./website.service";

@Module({
  imports: [],
  controllers: [WebsiteController],
  providers: [WebsiteService, TokenService, MailService],
})
export class WebsiteModule {}
