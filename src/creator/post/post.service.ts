import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../../lib/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto) {
    try {
      if (!dto.userId || !dto.text) {
        throw new BadRequestException('userId and text are required')
      }

      const userExists = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      })
      if (!userExists) {
        throw new NotFoundException('User not found')
      }

      const data: Prisma.PostCreateInput = {
        title: dto.title ?? null,
        text: dto.text,
        hashtag: dto.hashtag ?? null,
        file: dto.file ?? null,
        comment: dto.comment ?? false,
        view: dto.view ?? 'PUBLIC',
        user: { connect: { id: dto.userId } },
      }

      const post = await this.prisma.post.create({ data })
      return post
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to create post')
    }
  }

  async findAll() {
    try {
      return await this.prisma.post.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })
    } catch {
      throw new InternalServerErrorException('Failed to fetch posts')
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: { user: true },
      })

      if (!post) throw new NotFoundException('Post not found')
      return post
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to fetch post')
    }
  }

  async update(id: string, dto: UpdatePostDto) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } })
      if (!post) throw new NotFoundException('Post not found')

      const data: Prisma.PostUpdateInput = {
        title: dto.title ?? undefined,
        text: dto.text ?? undefined,
        hashtag: dto.hashtag ?? undefined,
        file: dto.file ?? undefined,
        comment: dto.comment ?? undefined,
        view: dto.view ?? undefined,
      }

      return await this.prisma.post.update({ where: { id }, data })
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to update post')
    }
  }

  async remove(id: string) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } })
      if (!post) throw new NotFoundException('Post not found')

      await this.prisma.post.delete({ where: { id } })
      return { message: 'Post deleted successfully' }
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to delete post')
    }
  }

  async toggleComment(id: string) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } })
      if (!post) throw new NotFoundException('Post not found')

      const updated = await this.prisma.post.update({
        where: { id },
        data: { comment: !post.comment },
      })
      return updated
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to toggle comment status')
    }
  }

  async findByUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new NotFoundException('User not found')

      const posts = await this.prisma.post.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })

      return posts
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('Failed to fetch user posts')
    }
  }
}
