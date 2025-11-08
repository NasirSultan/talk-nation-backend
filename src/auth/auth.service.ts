import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../lib/prisma/prisma.service'
import { JwtService } from '../lib/jwt/jwt.service'
import { RequestOtpDto } from './dto/request-otp.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // Step 1: Request OTP
  async requestOtp(dto: RequestOtpDto) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000)

    await this.prisma.otp.create({
      data: { email: dto.email, code: otpCode, expiresAt },
    })

    return { message: 'OTP sent to email', otp: otpCode }
  }

  // Step 2: Validate OTP
  async validateOtp(dto: ValidateOtpDto) {
    const otp = await this.prisma.otp.findFirst({
      where: { email: dto.email, code: dto.code, used: false },
    })

    if (!otp) throw new BadRequestException('Invalid OTP')
    if (otp.expiresAt < new Date()) throw new BadRequestException('OTP expired')

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    })

    return { message: 'OTP validated' }
  }

  // Step 3: Set password and register user
  async setPassword(dto: SetPasswordDto) {
    const hashed = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: {
        password: hashed,
        phone: dto.phone,
        country: dto.country,
      },
      create: {
        name: 'New User',
        email: dto.email,
        password: hashed,
        phone: dto.phone,
        country: dto.country,
        role: 'USER',
      },
    })

    const token = this.jwt.sign({ userId: user.id, email: user.email, role: user.role })

    return { message: 'Registered successfully', token, user }
  }

  // Step 4: Login with email + password
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    const token = this.jwt.sign({ userId: user.id, email: user.email, role: user.role })

    return { message: 'Login successful', token, user }
  }

  // Step 5: Reset password (OTP required before)
  async resetPassword(dto: ResetPasswordDto) {
    const otp = await this.prisma.otp.findFirst({
      where: { email: dto.email, used: false },
      orderBy: { createdAt: 'desc' },
    })
    if (!otp) throw new BadRequestException('OTP required')
    if (otp.expiresAt < new Date()) throw new BadRequestException('OTP expired')

    const hashed = await bcrypt.hash(dto.password, 10)

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashed },
    })

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    })

    return { message: 'Password reset successful' }
  }
}
