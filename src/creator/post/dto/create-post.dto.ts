import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator'
import { ViewType } from '@prisma/client'

export class CreatePostDto {
  @IsString()
  userId: string

  @IsOptional()
  @IsString()
  title?: string

  @IsString()
  text: string

  @IsOptional()
  @IsString()
  hashtag?: string

  @IsOptional()
  @IsString()
  file?: string

  @IsOptional()
  @IsBoolean()
  comment?: boolean

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType
}
