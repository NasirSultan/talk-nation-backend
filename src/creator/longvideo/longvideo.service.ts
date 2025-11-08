import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { CreateLongvideoDto } from './dto/create-longvideo.dto';
import { UpdateLongvideoDto } from './dto/update-longvideo.dto';

@Injectable()
export class LongvideoService {
  constructor(private prisma: PrismaService) {}

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
  }

  private async validateChapters(chapterIds: string[]) {
    if (!chapterIds || chapterIds.length === 0) return [];
    const existingChapters = await this.prisma.chapter.findMany({
      where: { id: { in: chapterIds } },
      select: { id: true },
    });
    const existingIds = existingChapters.map(c => c.id);
    const invalidIds = chapterIds.filter(id => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid chapter IDs: ${invalidIds.join(', ')}`);
    }
    return chapterIds.map(id => ({ id }));
  }

  async create(dto: CreateLongvideoDto) {
    try {
      await this.validateUser(dto.userId);
      const chaptersConnect = await this.validateChapters(dto.chapterIds || []);

      const video = await this.prisma.longvideo.create({
        data: {
          title: dto.title,
          description: dto.description,
          file: dto.file,
          thumbnails: dto.thumbnails || [],
          download: dto.download ?? true,
          categories: dto.categories || [],
          quality: dto.quality || 'AUTO',
          view: dto.view || 'PUBLIC',
          comment: dto.comment ?? true,
          reaction: dto.reaction ?? true,
          share: dto.share ?? true,
          thought: dto.thought ?? true,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
          userId: dto.userId,
          chapters: { connect: chaptersConnect },
        },
        include: { chapters: true, user: true },
      });

      return { success: true, message: 'Longvideo created successfully', data: video };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Failed to create Longvideo');
    }
  }

  async findAll() {
    try {
      const videos = await this.prisma.longvideo.findMany({
        include: { chapters: true, user: true },
      });
      return { success: true, message: 'Longvideos fetched successfully', data: videos };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Longvideos');
    }
  }

  async findOne(id: string) {
    try {
      const video = await this.prisma.longvideo.findUnique({
        where: { id },
        include: { chapters: true, user: true },
      });
      if (!video) throw new NotFoundException(`Longvideo with ID ${id} not found`);
      return { success: true, message: 'Longvideo fetched successfully', data: video };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Longvideo');
    }
  }

  async update(id: string, dto: UpdateLongvideoDto) {
    try {
      const existingVideo = await this.prisma.longvideo.findUnique({ where: { id } });
      if (!existingVideo) throw new NotFoundException(`Longvideo with ID ${id} not found`);

      if (dto.userId) await this.validateUser(dto.userId);
      const chaptersConnect = dto.chapterIds ? await this.validateChapters(dto.chapterIds) : undefined;

      const updatedVideo = await this.prisma.longvideo.update({
        where: { id },
        data: {
          ...dto,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
          chapters: chaptersConnect ? { set: chaptersConnect } : undefined,
        },
        include: { chapters: true, user: true },
      });

      return { success: true, message: 'Longvideo updated successfully', data: updatedVideo };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Failed to update Longvideo');
    }
  }

  async remove(id: string) {
    try {
      const existingVideo = await this.prisma.longvideo.findUnique({ where: { id } });
      if (!existingVideo) throw new NotFoundException(`Longvideo with ID ${id} not found`);

      await this.prisma.longvideo.delete({ where: { id } });
      return { success: true, message: 'Longvideo deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to delete Longvideo');
    }
  }
}
