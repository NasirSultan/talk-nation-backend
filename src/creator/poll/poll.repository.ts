import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PollRepository {
  constructor(private prisma: PrismaService) {}

  async createPoll(data: Prisma.PollCreateInput) {
    try {
      return await this.prisma.poll.create({ data, include: { options: true } });
    } catch {
      throw new InternalServerErrorException('Error creating poll in database');
    }
  }

  async findAll() {
    try {
      return await this.prisma.poll.findMany({
        include: { options: { include: { votes: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      throw new InternalServerErrorException('Error fetching polls from database');
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.poll.findUnique({
        where: { id },
        include: { options: { include: { votes: true } } },
      });
    } catch {
      throw new InternalServerErrorException('Error fetching poll from database');
    }
  }

  async update(id: string, data: Prisma.PollUpdateInput) {
    try {
      return await this.prisma.poll.update({
        where: { id },
        data,
        include: { options: true },
      });
    } catch {
      throw new InternalServerErrorException('Error updating poll in database');
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.poll.delete({ where: { id } });
    } catch {
      throw new InternalServerErrorException('Error deleting poll from database');
    }
  }

  async deleteOption(id: string) {
    try {
      return await this.prisma.pollOption.delete({ where: { id } });
    } catch {
      throw new InternalServerErrorException('Error deleting poll option from database');
    }
  }

  async hasUserVoted(optionId: string, userId: string) {
    try {
      return await this.prisma.pollVote.findFirst({
        where: { optionId, userId },
      });
    } catch {
      throw new InternalServerErrorException('Error checking existing vote');
    }
  }

  async addVote(optionId: string, userId: string) {
    try {
      return await this.prisma.pollVote.create({
        data: {
          option: { connect: { id: optionId } },
          user: { connect: { id: userId } },
        },
      });
    } catch {
      throw new InternalServerErrorException('Error adding vote');
    }
  }
}
