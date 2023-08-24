import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

let usersRepository: IUsersRepository
let statementsRepository: IStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
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
      type: 'deposit' as any,
      user_id: user.id as string
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
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
        type: 'deposit' as any,
        user_id: user.id as string
      })

      await getStatementOperationUseCase.execute({
        user_id: 'non-existing-user',
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(AppError)
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
        type: 'deposit' as any,
        user_id: user.id as string
      })

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'non-existing-statement'
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
