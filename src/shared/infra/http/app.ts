import 'reflect-metadata'
import 'express-async-errors'
import '../../container'

import express from 'express'
import cors from 'cors'

import createConnection from '../../../database'
import { router } from './routes'
import { error } from './middlewares/error'

createConnection()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1', router)
app.use(error)

export { app }
