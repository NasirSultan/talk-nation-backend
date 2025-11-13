import { Controller, Post, Body, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';

@Controller('comments')
export class CommentController {
  constructor(private service: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

@Get('target/:targetId')
async getComments(@Param('targetId') targetId: string) {
  return this.service.findAll(targetId);
}

}
