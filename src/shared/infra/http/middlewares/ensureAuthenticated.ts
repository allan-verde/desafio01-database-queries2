import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import authConfig from '../../../../config/auth'
import { JWTInvalidTokenError } from '../../../errors/JWTInvalidTokenError'
import { JWTTokenMissingError } from '../../../errors/JWTTokenMissingError'

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new JWTTokenMissingError()
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: userId } = verify(token, authConfig.jwt.secret) as IPayload

    request.user = {
      id: userId
    }

    next()
  } catch {
    throw new JWTInvalidTokenError()
  }
}
