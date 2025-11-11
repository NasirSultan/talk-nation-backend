import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PollRepository } from './poll.repository';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';

@Injectable()
export class PollService {
  constructor(private pollRepo: PollRepository) {}

  async create(dto: CreatePollDto) {
    if (!dto.authorId) {
      throw new BadRequestException('authorId is required to create a poll');
    }

    const optionsData = dto.options?.map((text) => ({ text })) || [];

    try {
      return await this.pollRepo.createPoll({
        question: dto.question,
        categories: dto.categories || [],
        view: dto.view || 'PUBLIC',
        author: { connect: { id: dto.authorId } },
        options: { create: optionsData },
        allowAnonymous: dto.allowAnonymous ?? true,
        showResults: dto.showResults ?? true,
        allowComments: dto.allowComments ?? true,
        allowReactions: dto.allowReactions ?? true,
        allowShare: dto.allowShare ?? true,
        sendNotification: dto.sendNotification ?? false,
        featured: dto.featured ?? false,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create poll');
    }
  }

  async findAll() {
    try {
      return await this.pollRepo.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch polls');
    }
  }

  async findOne(id: string) {
    try {
      const poll = await this.pollRepo.findOne(id);
      if (!poll) throw new NotFoundException('Poll not found');
      return poll;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch poll');
    }
  }

  async update(id: string, dto: UpdatePollDto) {
    try {
      return await this.pollRepo.update(id, {
        question: dto.question,
        categories: dto.categories,
        showResults: dto.showResults,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update poll');
    }
  }

  async delete(id: string) {
    try {
      return await this.pollRepo.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete poll');
    }
  }

  async vote(dto: VotePollDto) {
    try {
      const existingVote = await this.pollRepo.hasUserVoted(dto.optionId, dto.userId);
      if (existingVote) {
        throw new ConflictException('User has already voted for this option');
      }
      return await this.pollRepo.addVote(dto.optionId, dto.userId);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to add vote');
    }
  }
}
