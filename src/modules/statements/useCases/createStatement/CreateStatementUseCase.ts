import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'

import * as CreateStatementError from './CreateStatementError'

import { ICreateStatementDTO } from './ICreateStatementDTO'

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ userId, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new CreateStatementError.UserNotFound()
    }

    if (type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({
        userId
      })

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      userId,
      type,
      amount,
      description
    })

    return statementOperation
  }
}
