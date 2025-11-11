import { IsString, IsOptional, IsArray, IsBoolean, IsEnum } from 'class-validator';
import { ViewType } from '@prisma/client';

export class CreateReelDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  file: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsBoolean()
  browserSound?: boolean;

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType;

  @IsOptional()
  @IsBoolean()
  allowDuets?: boolean;

  @IsOptional()
  @IsBoolean()
  allowRemixes?: boolean;

  @IsOptional()
  @IsBoolean()
  showInFeed?: boolean;

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
}
