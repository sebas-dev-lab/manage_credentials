import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HealthCheck } from './modules/healthCheck/healthCheck.module';
import { setPath } from './infrastructure/envs/set.envs';
import { typeOrmAsyncConfig } from './infrastructure/database/config.database';
import { AuthMiddleware } from './middlewares/auth.middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: setPath(),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    HealthCheck,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'generics/version', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
