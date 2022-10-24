import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { databaseConnect } from './database';
import { router } from './routes';
import swaggerFile from './swagger.json';

async function init() {
  const app = express();

  const connection = await databaseConnect();

  if (!connection) {
    console.log('Error connecting to database. Exiting...');
    process.exit(1);
  }

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  app.use(router);

  app.listen(3333, () => console.log('Server is running on port 3333!'));
}

init();
