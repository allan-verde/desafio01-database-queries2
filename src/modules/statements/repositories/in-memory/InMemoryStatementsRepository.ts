import { Statement } from '../../entities/Statement'

import { IStatementsRepository } from '../IStatementsRepository'

import { ICreateStatementDTO } from '../../useCases/createStatement/ICreateStatementDTO'
import { IGetBalanceDTO } from '../../useCases/getBalance/IGetBalanceDTO'
import { IGetStatementOperationDTO } from '../../useCases/getStatementOperation/IGetStatementOperationDTO'

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = []

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement()

    Object.assign(statement, data)

    this.statements.push(statement)

    return statement
  }

  async findStatementOperation({
    statementId,
    userId
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(
      (operation) => operation.id === statementId && operation.userId === userId
    )
  }

  async getUserBalance({
    userId,
    withStatement = false
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = this.statements.filter(
      (operation) => operation.userId === userId
    )

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount
      } else {
        return acc - operation.amount
      }
    }, 0)

    if (withStatement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
