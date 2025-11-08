import { IsEmail, IsString } from 'class-validator'

export class ValidateOtpDto {
  @IsEmail()
  email: string

  @IsString()
  code: string
}
