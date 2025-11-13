import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionService {
  constructor(private prisma: PrismaService) {}

  async toggleReaction(dto: CreateReactionDto) {
    const targets = {
      postId: dto.postId,
      podcastId: dto.podcastId,
      longvideoId: dto.longvideoId,
      reelId: dto.reelId,
      blogId: dto.blogId,
      pollId: dto.pollId,
      livestreamId: dto.livestreamId,
    };

    // Ensure only one target is provided
    const targetKeys = Object.keys(targets).filter((key) => targets[key]);
    if (targetKeys.length !== 1) {
      throw new BadRequestException('Provide exactly one target ID.');
    }

    const targetKey = targetKeys[0];
    const targetId = targets[targetKey];

    // Check if reaction already exists for user and target
    const existingReaction = await this.prisma.reaction.findFirst({
      where: {
        userId: dto.userId,
        [targetKey]: targetId,
      },
    });

    if (existingReaction) {
      // If reaction type is same, remove (undo)
      if (existingReaction.type === dto.type) {
        await this.prisma.reaction.delete({ where: { id: existingReaction.id } });
        return { message: 'Reaction removed' };
      } else {
        // If different, update the type
        const updated = await this.prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type: dto.type },
        });
        return updated;
      }
    }

    // If no reaction exists, create new
    const newReaction = await this.prisma.reaction.create({
      data: {
        type: dto.type,
        userId: dto.userId,
        [targetKey]: targetId,
      },
    });

    return newReaction;
  }

  async getReactionsByTarget(targetType: string, targetId: string) {
    return this.prisma.reaction.findMany({
      where: { [targetType]: targetId },
    });
  }
}
