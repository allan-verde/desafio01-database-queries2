import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'
import * as GetStatementOperationError from './GetStatementOperationError'

interface IRequest {
  userId: string
  statementId: string
}

@injectable()
export class GetStatementOperationUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ userId, statementId }: IRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new GetStatementOperationError.UserNotFound()
    }

    const statementOperation =
      await this.statementsRepository.findStatementOperation({
        userId,
        statementId
      })

    if (!statementOperation) {
      throw new GetStatementOperationError.StatementNotFound()
    }

    return statementOperation
  }
}
