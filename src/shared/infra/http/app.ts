import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import upload from '@config/upload';
import AppError from '@shared/errors/AppError';
import { databaseConnect } from '@shared/infra/typeorm';
import '@shared/container';

import swaggerFile from '../../../swagger.json';
import rateLimiter from './middlewares/rateLimiter';
import { router } from './routes';

async function initializeDatabase() {
  const connection = await databaseConnect();

  if (!connection) {
    console.log('Error connecting to database. Exiting...');
    process.exit(1);
  }

  console.log('Database connected!', connection.options);

  return connection;
}

const app = express();

app.use(rateLimiter);
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.static(`${upload.tmpFolder}`));

app.use(router);
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        error: err.message,
      });
    }

    console.log(err);
    return response.status(500).json({
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app, initializeDatabase };
