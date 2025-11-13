import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  async create(@Body() dto: CreateShareDto) {
    // returns share with shareUrl
    return this.shareService.createShare(dto);
  }

  @Get(':id/count')
  async count(@Param('id') targetId: string) {
    return this.shareService.countShares(targetId);
  }
}
