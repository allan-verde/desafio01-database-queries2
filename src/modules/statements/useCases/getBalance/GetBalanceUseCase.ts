import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'

import { Statement } from '../../entities/Statement'

import { GetBalanceError } from './GetBalanceError'

interface IRequest {
  userId: string
}

interface IResponse {
  statement: Statement[]
  balance: number
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new GetBalanceError()
    }

    const balance = await this.statementsRepository.getUserBalance({
      userId,
      withStatement: true
    })

    return balance as IResponse
  }
}
