import { IsString, IsOptional, IsInt } from 'class-validator'

export class CreateChapterDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  file?: string

  @IsOptional()
  @IsInt()
  duration?: number
}
