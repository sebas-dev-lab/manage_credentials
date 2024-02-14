import { server_envs } from "src/infrastructure/envs/server.envs";

export const DOCS_PATH = 'api-docs';
export const SERVER_LOCAL_URI = `http://${server_envs.server_host}:${server_envs.port_server}`;

export const CONFIG_OPTIONS_SETUP = {
    explorer: true,
    swaggerOptions: {
        filter: true,
        showRequestDuration: true,
    }
} 