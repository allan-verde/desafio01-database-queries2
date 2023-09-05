import { Statement } from '../entities/Statement'

export class BalanceMap {
  static toDTO({
    statement,
    balance
  }: {
    statement: Statement[]
    balance: number
  }) {
    const parsedStatement = statement.map(
      ({ id, amount, description, type, createdAt, updatedAt }) => ({
        id,
        amount: Number(amount),
        description,
        type,
        createdAt,
        updatedAt
      })
    )

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
