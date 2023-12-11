import { server_envs } from '../envs/server.envs';

export function configCors(app) {
  const witheList = server_envs.server_whitelist
    ? server_envs.server_whitelist.split(';')
    : '*';
  app.enableCors({
    origin: function (origin, callback) {
      if (witheList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    preflightContinue: false,
    method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}

export function enableCors() {
  const witheList = server_envs.server_whitelist
    ? server_envs.server_whitelist.split(';')
    : '*';

  return function (origin, callback) {
    if (witheList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };
}
