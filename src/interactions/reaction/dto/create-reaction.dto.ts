import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  podcastId?: string;

  @IsOptional()
  @IsString()
  longvideoId?: string;

  @IsOptional()
  @IsString()
  reelId?: string;

  @IsOptional()
  @IsString()
  blogId?: string;

  @IsOptional()
  @IsString()
  pollId?: string;

  @IsOptional()
  @IsString()
  livestreamId?: string;
}
