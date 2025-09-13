import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const server = express();
let appInit: Promise<any> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.init();
  return app;
}

export default async function handler(req: Request, res: Response) {
  if (!appInit) {
    appInit = bootstrap();
  }
  await appInit;
  server(req, res);
}
