import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { ViewType } from '@prisma/client';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  content?: any; // JSON content for structured blog

  @IsOptional()
  @IsArray()
  media?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  seoWebbug?: string;

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType;

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReactions?: boolean;

  @IsOptional()
  @IsBoolean()
  allowShare?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
