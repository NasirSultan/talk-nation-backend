import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { VideoQuality, ViewType } from '@prisma/client';

export class CreateLongvideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsArray()
  thumbnails?: string[];

  @IsOptional()
  @IsBoolean()
  download?: boolean;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsEnum(VideoQuality)
  quality?: VideoQuality;

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType;

  @IsOptional()
  @IsBoolean()
  comment?: boolean;

  @IsOptional()
  @IsBoolean()
  reaction?: boolean;

  @IsOptional()
  @IsBoolean()
  share?: boolean;

  @IsOptional()
  @IsBoolean()
  thought?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsArray()
  chapterIds?: string[];

  @IsString()
  userId: string;
}
