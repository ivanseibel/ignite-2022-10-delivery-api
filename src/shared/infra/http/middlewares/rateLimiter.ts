import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 5, // 5 requests
    duration: 5, // per 1 second by IP
  });

  try {
    await rateLimiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
