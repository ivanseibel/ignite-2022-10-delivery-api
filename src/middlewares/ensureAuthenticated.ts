import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '../modules/accounts/repositories/Implementations/UsersRepository';

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: 'Token missing' });
  }

  const [, token] = authorization.split(' ');

  try {
    const { sub: user_id } = verify(token, 'd757dfd2421525dd8ba7eba884bf644a');

    const usersRepository = new UsersRepository();

    const user = usersRepository.findById(user_id as string);

    if (!user) {
      return response.status(401).json({ error: 'User does not exists' });
    }

    return next();
  } catch {
    return response.status(401).json({ error: 'Token invalid' });
  }
}

export { ensureAuthenticated };
