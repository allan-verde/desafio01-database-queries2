import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { OperationType } from '../../entities/Statement'

import { CreateStatementUseCase } from './CreateStatementUseCase'

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: userId } = request.user
    const { amount, description } = request.body

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType

    const createStatement = container.resolve(CreateStatementUseCase)

    const statement = await createStatement.execute({
      userId,
      type,
      amount,
      description
    })

    return response.status(201).json(statement)
  }
}
