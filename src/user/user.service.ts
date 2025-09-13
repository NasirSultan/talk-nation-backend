import { Injectable } from '@nestjs/common'

export interface User {
  id: number
  name: string
  email: string
}

@Injectable()
export class UserService {
  private static users: User[] = []
  private static idCounter = 1

  getAllUsers(): User[] {
    return UserService.users
  }

  getUserById(id: number): User | undefined {
    return UserService.users.find(user => user.id === id)
  }

  createUser(data: { name: string; email: string }): User {
    const newUser: User = {
      id: UserService.idCounter++,
      name: data.name,
      email: data.email,
    }
    UserService.users.push(newUser)
    return newUser
  }
}
