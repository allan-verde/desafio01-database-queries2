import { Router } from 'express'
import { ShowUserProfileController } from '../../../../modules/users/useCases/showUserProfile/ShowUserProfileController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const userProfileRouter = Router()

const showUserProfileController = new ShowUserProfileController()

userProfileRouter.use(ensureAuthenticated)

userProfileRouter.get('/', showUserProfileController.execute)

export { userProfileRouter }
