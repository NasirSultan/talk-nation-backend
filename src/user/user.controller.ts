import { Controller, Get, Post, Body, Param } from '@nestjs/common'
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
    return this.userService.getUserById(String(id))
  }

  @Post()
  createUser(@Body() body: { name: string; email: string }) {
    return this.userService.createUser(body)
  }
}
