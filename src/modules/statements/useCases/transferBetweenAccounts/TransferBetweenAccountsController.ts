import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { OperationType } from '../../entities/Statement'

import { TransferBetweenAccountsUseCase } from './TransferBetweenAccountsUseCase'

class TransferBetweenAccountsController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: senderId } = request.user
    const { user_id: userId } = request.params

    const { amount, description } = request.body

    const transferBetweenAccountsUseCase = container.resolve(
      TransferBetweenAccountsUseCase
    )

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType

    const statement = await transferBetweenAccountsUseCase.execute({
      senderId,
      userId,
      amount,
      description,
      type
    })

    return response.status(201).json(statement)
  }
}

export { TransferBetweenAccountsController }
