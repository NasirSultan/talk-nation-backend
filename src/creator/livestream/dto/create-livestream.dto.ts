import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { LiveMode, ViewType } from '@prisma/client';

export class CreateLivestreamDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsEnum(LiveMode)
  liveMode?: LiveMode = LiveMode.ROMAN;

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType = 'PUBLIC';

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean = true;

  @IsOptional()
  @IsBoolean()
  allowReactions?: boolean = true;

  @IsOptional()
  @IsBoolean()
  allowShare?: boolean = true;

  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsString()
  userId: string;

  @IsOptional()
  lobbySettings?: {
    enablePreShow?: boolean;
    allowEarlyChat?: boolean;
    showViewCount?: boolean;
  };
}
