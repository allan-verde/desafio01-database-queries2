import { OperationType } from '../../entities/Statement'

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'

import { StatementNotFound, UserNotFound } from './GetStatementOperationError'

let usersRepository: IUsersRepository
let statementsRepository: IStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    )
  })

  it('should be able to get statement operation', async () => {
    const user = await usersRepository.create({
      email: 'test@mail.com',
      name: 'Test',
      password: '1234'
    })

    const statement = await statementsRepository.create({
      amount: 100,
      description: 'Test',
      type: 'deposit' as OperationType,
      userId: user.id as string
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      userId: user.id as string,
      statementId: statement.id as string
    })

    expect(statementOperation).toHaveProperty('id')
  })

  it('should not be able to get statement operation if user does not exists', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: 'test@mail.com',
        name: 'Test',
        password: '1234'
      })

      const statement = await statementsRepository.create({
        amount: 100,
        description: 'Test',
        type: 'deposit' as OperationType,
        userId: user.id as string
      })

      await getStatementOperationUseCase.execute({
        userId: 'non-existing-user',
        statementId: statement.id as string
      })
    }).rejects.toEqual(new UserNotFound())
  })

  it('should not be able to get statement operation if statement does not exists', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: 'test@mail.com',
        name: 'Test',
        password: '1234'
      })

      await statementsRepository.create({
        amount: 100,
        description: 'Test',
        type: 'deposit' as OperationType,
        userId: user.id as string
      })

      await getStatementOperationUseCase.execute({
        userId: user.id as string,
        statementId: 'non-existing-statement'
      })
    }).rejects.toEqual(new StatementNotFound())
  })
})
