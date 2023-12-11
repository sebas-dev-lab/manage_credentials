import setEnviroments from './set.envs';
setEnviroments();

export const db_envs = {
  // Db
  db_name: process.env.DB_DATABASE_SYNC,
  db_user: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_legal_database: process.env.DB_DATABASE,
  db_legal_database_port: process.env.DB_PORT,
  db_legal_database_host: process.env.DB_HOST,
  url_legal_database_host: process.env.URL_LINK,
};
