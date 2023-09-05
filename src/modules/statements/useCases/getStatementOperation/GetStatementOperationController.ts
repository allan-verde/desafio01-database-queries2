import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

export class GetStatementOperationController {
  async execute(request: Request, response: Response) {
    const { id: userId } = request.user
    const { statementId } = request.params

    const getStatementOperation = container.resolve(
      GetStatementOperationUseCase
    )

    const statementOperation = await getStatementOperation.execute({
      userId,
      statementId
    })

    return response.json(statementOperation)
  }
}
