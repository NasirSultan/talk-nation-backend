import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
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


  async create(dto: CreateCommentDto) {
    const target = await this.detectTarget(dto.targetId);

    const data: any = {
      text: dto.text,
      userId: dto.userId,
      parentId: dto.parentId || null,
    };
    data[`${target.type}Id`] = target.id;

    return this.prisma.comment.create({ data });
  }

  async update(commentId: string, dto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: dto,
    });
  }

  async delete(commentId: string) {
    return this.prisma.comment.delete({ where: { id: commentId } });
  }

async findAll(targetId: string) {
  // Detect target type
  const entities = [
    { name: 'post', model: this.prisma.post },
    { name: 'podcast', model: this.prisma.podcast },
    { name: 'reel', model: this.prisma.reel },
    { name: 'blog', model: this.prisma.blog },
    { name: 'poll', model: this.prisma.poll },
    { name: 'longvideo', model: this.prisma.longvideo },
    { name: 'livestream', model: this.prisma.livestream },
  ];

  let targetType: string | null = null;
  for (const entity of entities) {
    const exists = await (entity.model as any).findUnique({ where: { id: targetId } });
    if (exists) {
      targetType = entity.name;
      break;
    }
  }

  if (!targetType) throw new NotFoundException('Target not found');

  // Fetch all top-level comments for that target
  const comments = await this.prisma.comment.findMany({
    where: {
      [`${targetType}Id`]: targetId,
      parentId: null, // top-level
    },
    include: {
      replies: true, // include replies
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments;
}


}
