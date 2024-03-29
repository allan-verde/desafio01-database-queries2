import { GetBalanceUseCase } from './GetBalanceUseCase'

import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'

import { GetBalanceError } from './GetBalanceError'

let getBalanceUseCase: GetBalanceUseCase
let statementsRepository: IStatementsRepository
let usersRepository: IUsersRepository

describe('Get Balance Use Case', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    )
  })

  it('should be able to get balance', async () => {
    const user = await usersRepository.create({
      email: 'test@mail.com',
      name: 'Test',
      password: '1234'
    })

    const balance = await getBalanceUseCase.execute({
      userId: user.id as string
    })

    expect(balance).toHaveProperty('balance')
  })

  it('should not be able to get balance if user does not exists', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        userId: 'non-existing-user'
      })
    }).rejects.toEqual(new GetBalanceError())
  })
})
