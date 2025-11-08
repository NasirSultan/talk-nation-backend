import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SetPasswordDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  role?: string

  @IsOptional()
  @IsString()
  file?: string
}
