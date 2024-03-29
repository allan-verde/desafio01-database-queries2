import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { GetBalanceController } from '../../../../modules/statements/useCases/getBalance/GetBalanceController'
import { CreateStatementController } from '../../../../modules/statements/useCases/createStatement/CreateStatementController'
import { GetStatementOperationController } from '../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationController'
import { TransferBetweenAccountsController } from '../../../../modules/statements/useCases/transferBetweenAccounts/TransferBetweenAccountsController'

const statementRouter = Router()

const getBalanceController = new GetBalanceController()
const createStatementController = new CreateStatementController()
const getStatementOperationController = new GetStatementOperationController()
const transferBetweenAccountsController =
  new TransferBetweenAccountsController()

statementRouter.use(ensureAuthenticated)

statementRouter.get('/balance', getBalanceController.execute)
statementRouter.post('/deposit', createStatementController.execute)
statementRouter.post('/withdraw', createStatementController.execute)
statementRouter.get('/:statement_id', getStatementOperationController.execute)
statementRouter.post(
  '/transfers/:user_id',
  transferBetweenAccountsController.execute
)

export { statementRouter }
