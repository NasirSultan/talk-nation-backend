import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Module({
  providers: [ReactionService, PrismaService],
  controllers: [ReactionController],
})
export class ReactionModule {}
