import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TokenModule } from "./token/token.module";
import { MailModule } from "./mail/mail.module";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { TokenService } from "./token/token.service";
import { WebsiteModule } from "./website/website.module";
import { WebsiteMiddleware } from "./middlewares/website.middleware";
import { WebsiteService } from "./website/website.service";
import { DiscussionModule } from "./discussion/discussion.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TokenModule,
    MailModule,
    WebsiteModule,
    DiscussionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, WebsiteService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "user", method: RequestMethod.GET });

    consumer
      .apply(WebsiteMiddleware)
      .forRoutes({ path: "discussion", method: RequestMethod.ALL });
  }
}
