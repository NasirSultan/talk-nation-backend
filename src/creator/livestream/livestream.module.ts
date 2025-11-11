import { Module } from '@nestjs/common';
import { LivestreamService } from './livestream.service';
import { LivestreamController } from './livestream.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Module({
  controllers: [LivestreamController],
  providers: [LivestreamService, PrismaService],
})
export class LivestreamModule {}
