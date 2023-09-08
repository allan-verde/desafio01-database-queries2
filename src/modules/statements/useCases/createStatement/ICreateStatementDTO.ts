import { Statement } from '../../entities/Statement'

export type ICreateStatementDTO = Pick<
  Statement,
  'userId' | 'description' | 'amount' | 'type' | 'senderId'
>
