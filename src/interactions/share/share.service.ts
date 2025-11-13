import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateShareDto } from './dto/create-share.dto';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  private async detectTarget(targetId: string) {
    const entities = [
      { name: 'post', model: this.prisma.post },
      { name: 'podcast', model: this.prisma.podcast },
      { name: 'reel', model: this.prisma.reel },
      { name: 'blog', model: this.prisma.blog },
      { name: 'poll', model: this.prisma.poll },
      { name: 'longvideo', model: this.prisma.longvideo },
      { name: 'livestream', model: this.prisma.livestream },
    ];

    for (const entity of entities) {
      const exists = await (entity.model as any).findUnique({ where: { id: targetId } });
      if (exists) return { type: entity.name, id: targetId };
    }

    throw new NotFoundException('Target entity not found');
  }

  async createShare(dto: CreateShareDto) {
    const target = await this.detectTarget(dto.targetId);

    const data: any = { userId: dto.userId };
    data[`${target.type}Id`] = target.id;

    const share = await this.prisma.share.create({ data });

    // Generate shareable link
    const shareUrl = `${process.env.APP_URL}/${target.type}/${target.id}`;

    return { ...share, shareUrl };
  }

  async countShares(targetId: string) {
    const target = await this.detectTarget(targetId);

    const count = await this.prisma.share.count({
      where: {
        [`${target.type}Id`]: target.id,
      },
    });

    return { targetId, targetType: target.type, shares: count };
  }
}
