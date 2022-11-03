import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    const { sub: user_id } = verify(token, 'd757dfd2421525dd8ba7eba884bf644a');

    const usersRepository = new UsersRepository();

    const user = usersRepository.findById(user_id as string);

    if (!user) {
      throw new AppError('User does not exists!', 404);
    }

    request.user = {
      id: user_id as string,
    };

    return next();
  } catch (error) {
    const { statusCode, message } = error as AppError;
    return response.status(statusCode).json({ error: message });
  }
}

export { ensureAuthenticated };
