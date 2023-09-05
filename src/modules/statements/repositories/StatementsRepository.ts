import { getRepository, Repository } from 'typeorm'

import { Statement } from '../entities/Statement'

import { IStatementsRepository } from './IStatementsRepository'

import { ICreateStatementDTO } from '../useCases/createStatement/ICreateStatementDTO'
import { IGetBalanceDTO } from '../useCases/getBalance/IGetBalanceDTO'
import { IGetStatementOperationDTO } from '../useCases/getStatementOperation/IGetStatementOperationDTO'

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>

  constructor() {
    this.repository = getRepository(Statement)
  }

  async create({
    userId,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      userId,
      amount,
      description,
      type
    })

    return this.repository.save(statement)
  }

  async findStatementOperation({
    statementId,
    userId
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statementId, {
      where: { userId }
    })
  }

  async getUserBalance({
    userId,
    withStatement = false
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository.find({
      where: { userId }
    })

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
