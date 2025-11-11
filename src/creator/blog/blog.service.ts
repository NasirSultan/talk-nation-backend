import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { LLMService } from '../../lib/llm/llm.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private llmService: LLMService,
  ) {}

async create(dto: CreateBlogDto) {
  try {
    // Convert structured JSON content to plain text for AI detection
    let plainTextContent = '';
    if (dto.content && Array.isArray(dto.content)) {
      plainTextContent = dto.content
        .map((block: any) => block.text || '')
        .join('\n');
    }

    // Detect hate speech using AI
    const hateSpeechFlag = await this.llmService.detectHateSpeech(plainTextContent);

    // Block creation if hate speech is detected
    if (hateSpeechFlag) {
      throw new BadRequestException('Cannot create blog: content contains hate speech.');
    }

    // Create blog in database if safe
    const blog = await this.prisma.blog.create({
      data: { ...dto, hateSpeechFlag },
    });

    return { message: 'Blog created successfully', blog };
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}




  async findAll() {
    return this.prisma.blog.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!blog) throw new BadRequestException(`Blog with ID ${id} not found`);
    return blog;
  }

async update(id: string, dto: UpdateBlogDto) {
  try {
    const blog = await this.findOne(id);

    let plainTextContent = '';
    if (dto.content && Array.isArray(dto.content)) {
      plainTextContent = dto.content.map((block: any) => block.text || '').join('\n');
    }

    const hateSpeechFlag = plainTextContent
      ? await this.llmService.detectHateSpeech(plainTextContent)
      : blog.hateSpeechFlag;

    if (hateSpeechFlag) {
      throw new BadRequestException('Cannot update blog: content contains hate speech.');
    }

    const updated = await this.prisma.blog.update({
      where: { id },
      data: { ...dto, hateSpeechFlag },
    });

    return { message: 'Blog updated successfully', blog: updated };
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}



  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }
}
