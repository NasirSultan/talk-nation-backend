import { IsString, IsOptional, IsInt, IsArray, IsEnum, IsBoolean, IsDateString } from 'class-validator'

export enum ViewType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FOLLOWERS = 'FOLLOWERS'
}

export class CreatePodcastDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  file?: string

  @IsOptional()
  @IsString()
  thumbnail?: string

  @IsOptional()
  @IsString()
  websiteUrl?: string

  @IsOptional()
  @IsString()
  urlDesc?: string

  @IsOptional()
  @IsInt()
  session?: number

  @IsOptional()
  @IsInt()
  episode?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[]

  @IsOptional()
  @IsEnum(ViewType)
  view?: ViewType

  @IsOptional()
  @IsBoolean()
  comment?: boolean

  @IsOptional()
  @IsBoolean()
  reaction?: boolean

  @IsOptional()
  @IsBoolean()
  share?: boolean

  @IsOptional()
  @IsBoolean()
  thought?: boolean

  @IsOptional()
  @IsDateString()
  scheduledAt?: string

  @IsString()
  userId: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chapterIds?: string[]
}
