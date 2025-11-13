import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('toggle')
  async toggle(@Body() dto: CreateReactionDto) {
    return this.reactionService.toggleReaction(dto);
  }

  @Get()
  async getByTarget(@Query('type') type: string, @Query('id') id: string) {
    return this.reactionService.getReactionsByTarget(type, id);
  }
}
