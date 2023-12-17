import { accessibleFieldsPlugin, accessibleRecordsPlugin } from "@casl/mongoose";
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from "body-parser";
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import { AppModule } from './app.module';
import configuration, { Environment } from "src/config/configuration";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";

async function bootstrap() {
  mongoose.plugin(accessibleRecordsPlugin);
  mongoose.plugin(accessibleFieldsPlugin);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: configuration().env === Environment.PRODUCTION ? ["error", "warn", "debug"] : ["log", "error", "warn", "debug"],
  });
  const configService = app.get(ConfigService);
  const environment = configService.get<Environment>("env");

  // Body Parser
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
        disableErrorMessages: environment === Environment.PRODUCTION,
        whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(process.env.npm_package_name)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
        displayRequestDuration: true,
        filter: true,
        plugins: [
            () => {
                return {
                    fn: {
                        opsFilter: (taggedOps: any, phrase: string) => {
                            return taggedOps.filter((tagObj, tag: string) => {
                                return tag.toLowerCase().includes(phrase.toLowerCase());
                            });
                        },
                    },
                };
            },
        ],
    },
  });

  // Security
  app.disable("x-powered-by");
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  // app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  app.enableCors({
      origin: configService.get<string[]|string>("corsOrigins"),
  });

  // Log Morgan
  app.use(morgan(environment === Environment.PRODUCTION ? "combined" : "dev"));

  const port = configService.get<number>("server.port");
  await app.listen(port);
}
bootstrap();