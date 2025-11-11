import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ReelService } from './reel.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { UpdateReelDto } from './dto/update-reel.dto';

@Controller('reels')
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @Post()
  create(@Body() dto: CreateReelDto) {
    return this.reelService.create(dto);
  }

  @Get()
  findAll() {
    return this.reelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReelDto) {
    return this.reelService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reelService.remove(id);
  }
}
