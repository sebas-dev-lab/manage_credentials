import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import setEnviroments from '../envs/set.envs';
setEnviroments();

const configService = new ConfigService();

console.log([__dirname + '/migration/*/.{ts,js}'])
export default new DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/../../core/domain/*.entities/*.entity.{ts,js}'],
    synchronize: false,
    logging: configService.get('nodenv') === 'development',
    migrations: [__dirname + '/migration/**/*.{ts,js}'],
    //migrationsTableName: 'migrations',
});