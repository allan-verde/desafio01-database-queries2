import { User } from '../../entities/User'

import { ICreateUserDTO } from '../../useCases/createUser/ICreateUserDTO'
import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = []

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId)
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, data)
    this.users.push(user)
    return user
  }
}
