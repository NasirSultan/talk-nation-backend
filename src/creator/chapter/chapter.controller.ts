import { Controller, Get, Post, Patch, Delete, Param, Body, HttpStatus } from '@nestjs/common'
import { ChapterService } from './chapter.service'
import { CreateChapterDto } from './dto/create-chapter.dto'
import { UpdateChapterDto } from './dto/update-chapter.dto'

@Controller('chapters')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Post()
  async create(@Body() dto: CreateChapterDto) {
    const chapter = await this.chapterService.create(dto)
    return {
      status: HttpStatus.CREATED,
      message: 'Chapter created successfully',
      data: chapter
    }
  }

  @Get()
  async findAll() {
    const chapters = await this.chapterService.findAll()
    return {
      status: HttpStatus.OK,
      data: chapters
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const chapter = await this.chapterService.findOne(id)
    return {
      status: HttpStatus.OK,
      data: chapter
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateChapterDto) {
    const chapter = await this.chapterService.update(id, dto)
    return {
      status: HttpStatus.OK,
      message: 'Chapter updated successfully',
      data: chapter
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.chapterService.remove(id)
    return {
      status: HttpStatus.OK,
      message: 'Chapter deleted successfully'
    }
  }
}
