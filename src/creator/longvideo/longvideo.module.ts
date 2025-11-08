import { Module } from '@nestjs/common';
import { LongvideoService } from './longvideo.service';
import { LongvideoController } from './longvideo.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Module({
  controllers: [LongvideoController],
  providers: [LongvideoService, PrismaService],
})
export class LongvideoModule {}
