import setEnviroments from './set.envs';
setEnviroments();

export const server_envs = {
  // Server
  mode_server: process.env.MODE_DEV,
  server_whitelist: process.env.SERVER_WITHE_LIST,
  base_path: process.env.SERVER_BASE_PATH,
  encrypt_key: process.env.SERVER_ENCRYPT_kEY,
  port_server: process.env.PORT_SERVER,
};

export const envs_server_config = {
  base_path: process.env.SERVER_BASE_PATH,
  encrypt_key: process.env.SERVER_ENCRYPT_kEY,

  // Assets
  assets_location: process.env.SERVER_ASSETS_LOCATION,
  assets_document: process.env.SERVER_ASSETS_DOCUMENTS_FILES,
};

export const encrypt_sites = {
  algorithm: process.env.SERVER_ALGORITHM,
  secret_key: process.env.SERVER_SECRET,
};
