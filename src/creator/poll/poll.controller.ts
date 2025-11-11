import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  create(@Body() dto: CreatePollDto) {
    // authorId is now part of the body
    return this.pollService.create(dto);
  }

  @Get()
  findAll() {
    return this.pollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePollDto) {
    return this.pollService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollService.delete(id);
  }

@Post('vote')
vote(@Body() dto: VotePollDto) {
  return this.pollService.vote(dto);
}

}
