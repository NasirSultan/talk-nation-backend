import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('toggle')
  async toggle(@Body() body: { userId: string; targetId: string }) {
    return this.bookmarkService.toggleBookmark(body.userId, body.targetId);
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.bookmarkService.listBookmarks(userId);
  }
}
