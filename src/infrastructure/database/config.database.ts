import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import setEnviroments from 'src/infrastructure/envs/set.envs';
const configService = new ConfigService();
setEnviroments();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      port: Number(configService.get<number>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      host: configService.get<string>('DB_HOST'),
      migrationsTableName: 'migrations_table',
      entities: [__dirname + '/../../core/domain/*.entities/*.entity.{ts,js}'],
      migrations: ['dist/server-app/migration/**/*.{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logger: 'advanced-console',
      //ssl: {
      //  rejectUnauthorized: true,
      //  minVersion: 'TLSv1.2',
      //},
    };
  },
};
