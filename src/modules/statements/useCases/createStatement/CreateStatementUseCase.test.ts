import { CreateStatementUseCase } from './CreateStatementUseCase'

import { OperationType } from '../../entities/Statement'

import { IStatementsRepository } from '../../../statements/repositories/IStatementsRepository'
import { InMemoryStatementsRepository } from '../../../statements/repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'

import { InsufficientFunds, UserNotFound } from './CreateStatementError'

let statementsRepository: IStatementsRepository
let inMemoryUsersRepository: IUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement Use Case', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      statementsRepository
    )
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
      type: 'deposit' as OperationType,
      userId: user.id as string
    })

    expect(statement).toHaveProperty('id')
    expect(statement.userId).toEqual(user.id)
  })

  it('should not be able to create a new statement if user does not exists', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: '',
        type: 'deposit' as OperationType,
        userId: 'non-existing-user'
      })
    }).rejects.toEqual(new UserNotFound())
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
        type: 'withdraw' as OperationType,
        userId: user.id as string
      })
    }).rejects.toEqual(new InsufficientFunds())
  })
})
