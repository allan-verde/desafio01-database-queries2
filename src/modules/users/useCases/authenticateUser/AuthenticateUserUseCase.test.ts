import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let authenticateUserUseCase: AuthenticateUserUseCase
let authenticateUserInMemoryRepository: IUsersRepository
let createUsersUseCase: CreateUserUseCase

const userData = {
  name: 'Test',
  email: 'test@mail.com',
  password: 'test'
}

describe('Authenticate User', () => {
  beforeEach(() => {
    authenticateUserInMemoryRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      authenticateUserInMemoryRepository
    )
    createUsersUseCase = new CreateUserUseCase(
      authenticateUserInMemoryRepository
    )
  })

  it('should be able to authenticate a user', async () => {
    await createUsersUseCase.execute(userData)

    const user = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password
    })

    expect(user).toHaveProperty('token')
  })

  it('should not be able to authenticate a non-existent user', async () => {
    expect(async () => {
      await createUsersUseCase.execute(userData)

      await authenticateUserUseCase.execute({
        email: 'error@mail.com',
        password: userData.password
      })
    }).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    expect(async () => {
      await createUsersUseCase.execute(userData)

      await authenticateUserUseCase.execute({
        email: userData.email,
        password: 'wrong_password'
      })
    }).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})
