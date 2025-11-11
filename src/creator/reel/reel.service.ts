import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { UpdateReelDto } from './dto/update-reel.dto';

@Injectable()
export class ReelService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReelDto) {
    try {
      const reel = await this.prisma.reel.create({
        data: { ...data, userId: data.userId },
      });
      return { message: 'Reel created successfully', reel };
    } catch (error) {
      throw new BadRequestException('Failed to create reel: ' + error.message);
    }
  }

  async findAll() {
    return this.prisma.reel.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const reel = await this.prisma.reel.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!reel) throw new NotFoundException(`Reel with ID ${id} not found`);
    return reel;
  }

  async update(id: string, data: UpdateReelDto) {
    const reel = await this.prisma.reel.findUnique({ where: { id } });
    if (!reel) throw new NotFoundException(`Reel with ID ${id} not found`);

    const updated = await this.prisma.reel.update({
      where: { id },
      data,
    });
    return { message: 'Reel updated successfully', reel: updated };
  }

  async remove(id: string) {
    const reel = await this.prisma.reel.findUnique({ where: { id } });
    if (!reel) throw new NotFoundException(`Reel with ID ${id} not found`);

    await this.prisma.reel.delete({ where: { id } });
    return { message: 'Reel deleted successfully' };
  }
}
