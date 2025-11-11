import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';


@Injectable()
export class LivestreamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLivestreamDto) {
    const { lobbySettings, ...rest } = dto;
    return this.prisma.livestream.create({
      data: {
        ...rest,
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
      include: {
        lobbySettings: true,
      },
    });
  }

  async findAll() {
    return this.prisma.livestream.findMany({ include: { lobbySettings: true } });
  }

  async findOne(id: string) {
    return this.prisma.livestream.findUnique({
      where: { id },
      include: { lobbySettings: true },
    });
  }

  async update(id: string, dto: UpdateLivestreamDto) {
    const { lobbySettings, ...rest } = dto;
    return this.prisma.livestream.update({
      where: { id },
      data: {
        ...rest,
        lobbySettings: lobbySettings
          ? { update: lobbySettings }
          : undefined,
      },
      include: { lobbySettings: true },
    });
  }

  async remove(id: string) {
    return this.prisma.livestream.delete({ where: { id } });
  }
}
