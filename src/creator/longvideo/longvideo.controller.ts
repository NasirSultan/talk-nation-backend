import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { LongvideoService } from './longvideo.service';
import { CreateLongvideoDto } from './dto/create-longvideo.dto';
import { UpdateLongvideoDto } from './dto/update-longvideo.dto';

@Controller('longvideos')
export class LongvideoController {
  constructor(private readonly service: LongvideoService) {}

  @Post()
  create(@Body() dto: CreateLongvideoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLongvideoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
