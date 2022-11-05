import { NextFunction, Request, Response } from 'express';

import AppError from '@shared/errors/AppError';

function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  const { user } = request;

  if (!user.isAdmin) {
    throw new AppError('User is not an admin', 401);
  }

  return next();
}

export { ensureAdmin };
