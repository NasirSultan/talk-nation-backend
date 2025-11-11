import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { LLMService } from '../../lib/llm/llm.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, PrismaService, LLMService],
})
export class BlogModule {}
