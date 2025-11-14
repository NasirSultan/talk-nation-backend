import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private contentRelations = [
    { model: 'post', field: 'postId' },
    { model: 'podcast', field: 'podcastId' },
    { model: 'reel', field: 'reelId' },
    { model: 'blog', field: 'blogId' },
    { model: 'poll', field: 'pollId' },
    { model: 'longvideo', field: 'longvideoId' },
    { model: 'livestream', field: 'livestreamId' },
  ] as const;

  private async detectContentType(targetId: string) {
    for (const { model, field } of this.contentRelations) {
      const exists = await (this.prisma as any)[model].findUnique({ where: { id: targetId } });
      if (exists) return { model, field };
    }
    throw new NotFoundException('Target content not found');
  }

  async createImpression(dto: CreateAnalyticsDto) {
    if (!dto.userId || !dto.targetId) {
      throw new BadRequestException('userId and targetId are required');
    }

    const { field } = await this.detectContentType(dto.targetId);

    return this.prisma.impression.create({
      data: {
        userId: dto.userId,
        [field]: dto.targetId,
      },
    });
  }

async createView(dto: CreateAnalyticsDto) {
  if (!dto.userId || !dto.targetId) {
    throw new BadRequestException('userId and targetId are required');
  }

  const { field } = await this.detectContentType(dto.targetId);

  return this.prisma.view.create({
    data: {
      userId: dto.userId,
      [field]: dto.targetId,
    },
  });
}


  async getImpressions(targetId: string) {
    const { field } = await this.detectContentType(targetId);
    return this.prisma.impression.findMany({ where: { [field]: targetId } });
  }

  async getViews(targetId: string) {
    const { field } = await this.detectContentType(targetId);
    return this.prisma.view.findMany({ where: { [field]: targetId } });
  }
}
