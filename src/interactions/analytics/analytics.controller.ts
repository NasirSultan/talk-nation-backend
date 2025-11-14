import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('impression')
  async createImpression(@Body() dto: CreateAnalyticsDto) {
    try {
      const result = await this.analyticsService.createImpression(dto);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create impression' };
    }
  }

  @Post('view')
  async createView(@Body() dto: CreateAnalyticsDto & { duration?: number }) {
    try {
      const result = await this.analyticsService.createView(dto);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create view' };
    }
  }

  @Get('impressions/:targetId')
  async getImpressions(@Param('targetId') targetId: string) {
    try {
      const result = await this.analyticsService.getImpressions(targetId);
      return { success: true, count: result.length, data: result };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to fetch impressions' };
    }
  }

  @Get('views/:targetId')
  async getViews(@Param('targetId') targetId: string) {
    try {
      const result = await this.analyticsService.getViews(targetId);
      return { success: true, count: result.length, data: result };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to fetch views' };
    }
  }
}
