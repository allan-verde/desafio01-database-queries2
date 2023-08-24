import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let authenticateUserUseCase: AuthenticateUserUseCase
let authenticateUserInMemoryRepository: IUsersRepository
let createUsersUseCase: CreateUserUseCase

const user_data = {
  name: 'Test',
  email: 'test@mail.com',
  password: 'test'
}

describe('Authenticate User', () => {

  beforeEach(() => {
    authenticateUserInMemoryRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(authenticateUserInMemoryRepository)
    createUsersUseCase = new CreateUserUseCase(authenticateUserInMemoryRepository)
  })

  it('should be able to authenticate a user', async () => {
    await createUsersUseCase.execute(user_data)

    const user = await authenticateUserUseCase.execute({
      email: user_data.email,
      password: user_data.password,
    })

    expect(user).toHaveProperty('token')
  })

  it('should not be able to authenticate a non-existent user', async () => {
    expect(async () => {
      await createUsersUseCase.execute(user_data)

      await authenticateUserUseCase.execute({
        email: 'error@mail.com',
        password: user_data.password,
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    expect(async () => {
      await createUsersUseCase.execute(user_data)

      await authenticateUserUseCase.execute({
        email: user_data.email,
        password: 'wrong_password',
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
