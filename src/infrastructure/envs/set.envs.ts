import * as dotenv from 'dotenv';
import * as path from 'path';

export const setPath = (): string => {
  let dir = null;
  switch (process.env.MODE_DEV) {
    case 'stage':
      dir = path.join(__dirname, '.env.stage');
      break;
    case 'development':
      dir = path.join(__dirname, '.env.dev');
      break;
    case 'production':
      dir = path.join(__dirname, '.env.production');
      break;
    default:
      dir = path.join(__dirname, '.env.local');
      break;
  }
  return dir;
};

const setEnviroments = () => {
  return dotenv.config({
    path: setPath(),
  });
};

export default setEnviroments;
