import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { PodcastService } from './podcast.service'
import { CreatePodcastDto } from './dto/create-podcast.dto'
import { UpdatePodcastDto } from './dto/update-podcast.dto'

@Controller('podcasts')
export class PodcastController {
  constructor(private podcastService: PodcastService) {}

  @Post()
  create(@Body() dto: CreatePodcastDto) {
    return this.podcastService.create(dto)
  }

  @Get()
  findAll() {
    return this.podcastService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePodcastDto) {
    return this.podcastService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(id)
  }
}
