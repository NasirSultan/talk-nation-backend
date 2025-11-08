import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../lib/prisma/prisma.service'
import { CreateChapterDto } from './dto/create-chapter.dto'
import { UpdateChapterDto } from './dto/update-chapter.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChapterDto) {
    try {
      return await this.prisma.chapter.create({ data: dto })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid data provided')
      }
      throw new InternalServerErrorException('Failed to create chapter')
    }
  }

  async findAll() {
    try {
      return await this.prisma.chapter.findMany()
    } catch {
      throw new InternalServerErrorException('Failed to fetch chapters')
    }
  }

  async findOne(id: string) {
    try {
      const chapter = await this.prisma.chapter.findUnique({ where: { id } })
      if (!chapter) throw new NotFoundException('Chapter not found')
      return chapter
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to fetch chapter')
    }
  }

  async update(id: string, dto: UpdateChapterDto) {
    try {
      await this.findOne(id)
      return await this.prisma.chapter.update({ where: { id }, data: dto })
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid data for update')
      }
      throw new InternalServerErrorException('Failed to update chapter')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.chapter.delete({ where: { id } })
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to delete chapter')
    }
  }
}
