import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Injectable()
export class BookmarkService {
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

  async toggleBookmark(userId: string, targetId: string) {
    const target = await this.detectTarget(targetId);

    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, [`${target.type}Id`]: target.id },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      return { action: 'removed', targetId: target.id, targetType: target.type };
    }

    const data: any = { userId };
    data[`${target.type}Id`] = target.id;

    await this.prisma.bookmark.create({ data });
    return { action: 'added', targetId: target.id, targetType: target.type };
  }

  async listBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
