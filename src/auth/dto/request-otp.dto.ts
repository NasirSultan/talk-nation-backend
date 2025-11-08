import { IsEmail, IsString } from 'class-validator'

export class RequestOtpDto {
  @IsString()
  name: string

  @IsEmail()
  email: string
}
