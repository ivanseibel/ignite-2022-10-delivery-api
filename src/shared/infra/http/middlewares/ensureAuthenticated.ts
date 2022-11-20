import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authorization.split(' ');

  const { sub: user_id } = verify(token, process.env.TOKEN_SECRET);

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(user_id as string);

  if (!user) {
    throw new AppError('User does not exists!', 404);
  }

  request.user = {
    id: user_id as string,
    isAdmin: user.is_admin,
  };

  return next();
}

export { ensureAuthenticated };
