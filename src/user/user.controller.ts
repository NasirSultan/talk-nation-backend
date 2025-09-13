import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.userService.getUserById(Number(id))
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return user
  }

  @Post()
  createUser(@Body() body: { name: string; email: string }) {
    if (!body.name || !body.email) {
      throw new Error('Name and email are required')
    }
    return this.userService.createUser(body)
  }
}
