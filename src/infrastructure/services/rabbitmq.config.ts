import { rabbitmq_envs } from "../envs/server.envs";

export const configOptions = {
    urls: rabbitmq_envs.urls.split(';').filter(url => url !== ''),
    queue: rabbitmq_envs.queue,
    queueOptions: {
        durable: false,
    },
}