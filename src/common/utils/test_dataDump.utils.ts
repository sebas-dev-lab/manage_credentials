import * as pg from 'pg';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';
import { connection } from 'src/infrastructure/database/connection.database';
import { findAuthUserById } from '../sql/auth_user_generics.sql';

export const runDataDump = async (fn: () => void): Promise<void> => {
  const client = new pg.Client(connection);
  await client.connect();
  try {
    const test = await client.query(findAuthUserById());
    if (!test || test.rowCount === 0) {
      fn();
    } else {
      Logger.info('No data dump added');
    }
    await client.end();
  } catch (e) {
    Logger.error(e.stack);
    await client.end();
  }
};
