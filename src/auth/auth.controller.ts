import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RequestOtpDto } from './dto/request-otp.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto)
  }

  @Post('validate-otp')
  validateOtp(@Body() dto: ValidateOtpDto) {
    return this.authService.validateOtp(dto)
  }

  @Post('set-password')
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }
}
