import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  app.setGlobalPrefix(process.env.API_PREFIX);
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    }),
  );

  await app.listen(port);
}
bootstrap();
