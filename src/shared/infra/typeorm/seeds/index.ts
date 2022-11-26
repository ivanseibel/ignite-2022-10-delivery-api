import { databaseConnect } from '..';

import { createAdminUser } from './admin';

async function seed() {
  const connection = await databaseConnect('localhost');
  if (!connection) {
    console.log('Error connecting to database. Exiting...');
    process.exit(1);
  }
  await createAdminUser(connection);

  await connection.close();
}

seed();
