import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../lib/prisma/prisma.service'
import { CreatePodcastDto } from './dto/create-podcast.dto'
import { UpdatePodcastDto } from './dto/update-podcast.dto'

@Injectable()
export class PodcastService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePodcastDto) {
    try {

      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } })
      if (!user) throw new BadRequestException('User does not exist')

      let chapterConnect: Array<{ id: string }> = []
      if (dto.chapterIds?.length) {
        const chapters = await this.prisma.chapter.findMany({
          where: { id: { in: dto.chapterIds } }
        })
        if (chapters.length !== dto.chapterIds.length)
          throw new BadRequestException('One or more chapters do not exist')
        chapterConnect = dto.chapterIds.map(id => ({ id }))
      }

      const { chapterIds, ...podcastData } = dto

      const podcast = await this.prisma.podcast.create({
        data: {
          ...podcastData,
          chapters: chapterConnect.length ? { connect: chapterConnect } : undefined
        },
        include: { chapters: true }
      })

      return { success: true, message: 'Podcast created successfully', data: podcast }
    } catch (err) {
      if (err instanceof BadRequestException) throw err
      console.error(err)
      throw new InternalServerErrorException('Failed to create podcast')
    }
  }

  async update(id: string, dto: UpdatePodcastDto) {
    try {
      const exists = await this.prisma.podcast.findUnique({ where: { id } })
      if (!exists) throw new NotFoundException('Podcast not found')

      // Check if chapters exist if provided
      let chapterConnect: Array<{ id: string }> | undefined = undefined
      if (dto.chapterIds?.length) {
        const chapters = await this.prisma.chapter.findMany({
          where: { id: { in: dto.chapterIds } }
        })
        if (chapters.length !== dto.chapterIds.length)
          throw new BadRequestException('One or more chapters do not exist')
        chapterConnect = dto.chapterIds.map(id => ({ id }))
      }

      const { chapterIds, ...podcastData } = dto

      const updated = await this.prisma.podcast.update({
        where: { id },
        data: {
          ...podcastData,
          chapters: chapterConnect ? { set: chapterConnect } : undefined
        },
        include: { chapters: true }
      })

      return { success: true, message: 'Podcast updated successfully', data: updated }
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) throw err
      console.error(err)
      throw new InternalServerErrorException('Failed to update podcast')
    }
  }

  async findAll() {
    try {
      const podcasts = await this.prisma.podcast.findMany({ include: { chapters: true } })
      return { success: true, data: podcasts }
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException('Failed to fetch podcasts')
    }
  }

  async findOne(id: string) {
    try {
      const podcast = await this.prisma.podcast.findUnique({ where: { id }, include: { chapters: true } })
      if (!podcast) throw new NotFoundException('Podcast not found')
      return { success: true, data: podcast }
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      console.error(err)
      throw new InternalServerErrorException('Failed to fetch podcast')
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.podcast.findUnique({ where: { id } })
      if (!exists) throw new NotFoundException('Podcast not found')

      await this.prisma.podcast.delete({ where: { id } })
      return { success: true, message: 'Podcast deleted successfully' }
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      console.error(err)
      throw new InternalServerErrorException('Failed to delete podcast')
    }
  }
}
