import { Module } from '@nestjs/common';
import { ReelService } from './reel.service';
import { ReelController } from './reel.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Module({
  controllers: [ReelController],
  providers: [ReelService, PrismaService],
})
export class ReelModule {}
