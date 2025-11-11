import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { ViewType } from '@prisma/client';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  file: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  content: any; // JSON type for structured content

  @IsOptional()
  @IsArray()
  media?: string[];

  @IsArray()
  categories: string[];

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

  @IsString()
  authorId: string;
}
