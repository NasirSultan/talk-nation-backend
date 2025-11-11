import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Get()
  async findAll() {
    const blogs = await this.blogService.findAll();
    return { message: 'Blogs fetched successfully', data: blogs };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogService.findOne(id);
    return { message: 'Blog fetched successfully', data: blog };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
