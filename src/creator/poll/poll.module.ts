import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { PollRepository } from './poll.repository';

@Module({
  controllers: [PollController],
  providers: [PollService, PollRepository, PrismaService],
})
export class PollModule {}
