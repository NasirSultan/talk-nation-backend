import { Module } from '@nestjs/common'
import { PodcastService } from './podcast.service'
import { PodcastController } from './podcast.controller'
import { PrismaService } from '../../lib/prisma/prisma.service'

@Module({
  controllers: [PodcastController],
  providers: [PodcastService, PrismaService]
})
export class PodcastModule {}
