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

@Module({
  imports: [ConfigModule.forRoot(), UserModule, TokenModule, MailModule],
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "user", method: RequestMethod.GET });
  }
}
