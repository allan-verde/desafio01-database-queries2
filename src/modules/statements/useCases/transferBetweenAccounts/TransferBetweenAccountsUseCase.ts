import { inject, injectable } from 'tsyringe'
import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { OperationType, Statement } from '../../entities/Statement'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'
import * as TransferBetweenAccountsError from './TransferBetweenAccountsError'

interface IRequest {
  senderId: string
  userId: string
  amount: number
  description: string
  type: OperationType
}

@injectable()
class TransferBetweenAccountsUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    amount,
    description,
    senderId,
    userId,
    type
  }: IRequest): Promise<Statement> {
    console.log({
      amount,
      description,
      senderId,
      userId,
      type
    })
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new TransferBetweenAccountsError.UserNotFound()

    const sender = await this.usersRepository.findById(senderId)

    if (!sender) throw new TransferBetweenAccountsError.SenderNotFound()

    const { balance } = await this.statementsRepository.getUserBalance({
      userId: senderId
    })

    if (balance < amount)
      throw new TransferBetweenAccountsError.InsufficientFunds()

    const statementOperation = await this.statementsRepository.create({
      userId,
      type,
      amount,
      description,
      senderId
    })

    return statementOperation
  }
}

export { TransferBetweenAccountsUseCase }
