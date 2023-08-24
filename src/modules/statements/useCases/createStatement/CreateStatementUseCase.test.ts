import { IStatementsRepository } from '../../../statements/repositories/IStatementsRepository'
import { InMemoryStatementsRepository } from '../../../statements/repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementUseCase } from './CreateStatementUseCase'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { AppError } from '../../../../shared/errors/AppError'

let statementsRepository: IStatementsRepository
let inMemoryUsersRepository: IUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement Use Case', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, statementsRepository)
  })

  it('should be able to create a new statement', async () => {
    const user = await inMemoryUsersRepository.create({
      email: 'test@mail.com',
      name: 'Test',
      password: '1234'
    })

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: '',
      type: 'deposit' as any,
      user_id: user.id as string
    })

    expect(statement).toHaveProperty('id')
    expect(statement.user_id).toEqual(user.id)
  })

  it('should not be able to create a new statement if user does not exists', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: '',
        type: 'deposit' as any,
        user_id: 'non-existing-user'
      })
    }
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a new statement if user does not have enough funds', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: 'test@mail.com',
        name: 'Test',
        password: '1234'
      })

      await createStatementUseCase.execute({
        amount: 100,
        description: '',
        type: 'withdraw' as any,
        user_id: user.id as string
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
