import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface IOptions extends PostgresConnectionOptions {
  host: string;
}

export async function databaseConnect(): Promise<Connection | undefined> {
  try {
    const connectionOptions = (await getConnectionOptions()) as IOptions;
    connectionOptions.host = 'database';
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
