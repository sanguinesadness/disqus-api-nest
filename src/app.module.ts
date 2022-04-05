import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./lib/user/user.module";
import { TokenModule as UserTokenModule } from "./lib/token/token.module";
import { TokenModule as WebsiteTokenModule } from "./main/token/token.module";
import { TokenService as UserTokenService } from "./lib/token/token.service";
import { TokenService as WebsiteTokenService } from "./main/token/token.service";
import { MailModule } from "./mail/mail.module";
import { UserAuthMiddleware } from "./middlewares/user.auth.middleware";
import { WebsiteModule } from "./main/website/website.module";
import { WebsiteTokenMiddleware } from "./middlewares/website.token.middleware";
import { WebsiteService } from "./main/website/website.service";
import { DiscussionModule } from "./lib/discussion/discussion.module";
import { CommentModule } from "./lib/comment/comment.module";
import { MailService } from "./mail/mail.service";
import { WebsiteAuthMiddleware } from "./middlewares/website.auth.middleware";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    UserTokenModule,
    WebsiteTokenModule,
    MailModule,
    WebsiteModule,
    DiscussionModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserTokenService,
    WebsiteTokenService,
    WebsiteService,
    MailService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebsiteTokenMiddleware)
      .exclude(
        {
          path: `${process.env.API_PREFIX}/website/(.*)`,
          method: RequestMethod.ALL,
        },
        {
          path: `${process.env.API_PREFIX}/website`,
          method: RequestMethod.GET,
        },
      )
      .forRoutes("*");

    consumer.apply(UserAuthMiddleware).forRoutes(
      {
        path: "comment",
        method: RequestMethod.ALL,
      },
      {
        path: `/user/current`,
        method: RequestMethod.GET,
      },
    );

    consumer
      .apply(WebsiteAuthMiddleware)
      .exclude(
        {
          path: `${process.env.API_PREFIX}/website/login`,
          method: RequestMethod.POST,
        },
        {
          path: `${process.env.API_PREFIX}/website/register`,
          method: RequestMethod.POST,
        },
      )
      .forRoutes({ path: "website/*", method: RequestMethod.ALL });
  }
}
