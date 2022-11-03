import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import AppError from '@shared/errors/AppError';
import { databaseConnect } from '@shared/infra/typeorm';

import swaggerFile from '../../../swagger.json';
import { router } from './routes';

async function init() {
  const app = express();

  const connection = await databaseConnect();

  if (!connection) {
    console.log('Error connecting to database. Exiting...');
    process.exit(1);
  }

  app.use(express.json());
  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  app.use(router);
  app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          error: err.message,
        });
      }

      return response.status(500).json({
        message: `Internal server error - ${err.message}`,
      });
    }
  );

  app.listen(3333, () => console.log('Server is running on port 3333!'));
}

init();
