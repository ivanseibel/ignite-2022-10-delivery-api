import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface IOptions extends PostgresConnectionOptions {
  host: string;
  database: string;
}

export async function databaseConnect(
  host = 'localhost',
  database = 'rentapi'
): Promise<Connection | undefined> {
  try {
    const connectionOptions = (await getConnectionOptions()) as IOptions;

    connectionOptions.host =
      process.env.NODE_ENV === 'test' ? 'localhost' : host;

    connectionOptions.database = database;

    const connection = await createConnection({
      ...connectionOptions,
    });

    console.log('Database connected!');

    return connection;
  } catch (error) {
    console.log('Error connecting to database: ', error);
    return undefined;
  }
}
