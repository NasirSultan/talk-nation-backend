import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LivestreamService {
  constructor(private prisma: PrismaService) {}

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  async create(dto: CreateLivestreamDto) {
    const { userId, lobbySettings, ...rest } = dto;
    try {
      await this.validateUser(userId);

      const livestream = await this.prisma.livestream.create({
        data: {
          ...rest,
          userId,
          lobbySettings: lobbySettings
            ? {
                create: {
                  enablePreShow: lobbySettings.enablePreShow ?? false,
                  allowEarlyChat: lobbySettings.allowEarlyChat ?? false,
                  showViewCount: lobbySettings.showViewCount ?? true,
                },
              }
            : undefined,
        },
        include: { lobbySettings: true },
      });
      return livestream;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to create livestream');
    }
  }

  async findAll() {
    try {
      return await this.prisma.livestream.findMany({ include: { lobbySettings: true } });
    } catch {
      throw new InternalServerErrorException('Failed to fetch livestreams');
    }
  }

  async findOne(id: string) {
    try {
      const livestream = await this.prisma.livestream.findUnique({
        where: { id },
        include: { lobbySettings: true },
      });
      if (!livestream) {
        throw new NotFoundException(`Livestream with id ${id} not found`);
      }
      return livestream;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to fetch livestream');
    }
  }

  async update(id: string, dto: UpdateLivestreamDto) {
    const { userId, lobbySettings, ...rest } = dto;
    try {
      const existing = await this.prisma.livestream.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Livestream with id ${id} not found`);
      }

      if (userId) {
        await this.validateUser(userId);
      }

      const updated = await this.prisma.livestream.update({
        where: { id },
        data: {
          ...rest,
          userId: userId ?? existing.userId,
          lobbySettings: lobbySettings ? { update: lobbySettings } : undefined,
        },
        include: { lobbySettings: true },
      });
      return updated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to update livestream');
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.livestream.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Livestream with id ${id} not found`);
      }
      return await this.prisma.livestream.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to delete livestream');
    }
  }
}
