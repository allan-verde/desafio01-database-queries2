import { IUsersRepository } from '../../repositories/IUsersRepository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'

import { CreateUserUseCase } from './CreateUserUseCase'

import { CreateUserError } from './CreateUserError'

let createUserUseCase: CreateUserUseCase
let createUserInMemoryRepository: IUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    createUserInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(createUserInMemoryRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test',
      email: 'test@mail.com',
      password: 'test'
    })

    expect(user).toHaveProperty('id')
    expect(user.email).toBe('test@mail.com')
  })

  it('should be able to not create a new user with same email', async () => {
    const email = 'test@mail.com'

    expect(async () => {
      await createUserUseCase.execute({
        email,
        name: 'Test',
        password: 'test'
      })

      await createUserUseCase.execute({
        email,
        name: 'Test',
        password: 'test'
      })
    }).rejects.toEqual(new CreateUserError())
  })
})
