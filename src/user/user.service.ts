import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../lib/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.user.findMany()
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return user
  }

  createUser(data: { name: string; email: string }) {
    return this.prisma.user.create({ data })
  }
}
