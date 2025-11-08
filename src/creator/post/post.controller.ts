import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import type { Express } from 'express'

import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname))
        },
      }),
    }),
  )
  async create(@Body() createPostDto: CreatePostDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) createPostDto.file = file.filename
    return this.postService.create(createPostDto)
  }

  @Get()
  async findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id)
  }

  @Patch(':id/toggle-comment')
  async toggleComment(@Param('id') id: string) {
    return this.postService.toggleComment(id)
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.postService.findByUser(userId)
  }
}
