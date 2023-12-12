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
import { ManageUsersModule } from './modules/manageUsers/manageUsers.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthUseCase } from './infrastructure/useCases/authorization/auth.usecase';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthUserRepository } from './core/repositories/auth_users.repository';
import { AuthSessionReposiroty } from './core/repositories/auth_session.repository';
import { AuthUsers } from './core/domain/creds_manager.entities/auth_users.entity';
import { AuthSessions } from './core/domain/creds_manager.entities/auth_sessions.entity';
import { PassportModule } from '@nestjs/passport';
import { ModuleRepository } from './core/repositories/auth_module.resporitory';
import { AuthModules } from './core/domain/creds_manager.entities/auth_modules.entity';
import { AuthRoleRepository } from './core/repositories/auth_role.repository';
import { AuthRoles } from './core/domain/creds_manager.entities/auth_roles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: setPath(),
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      AuthUsers,
      AuthSessions,
      AuthModules,
      AuthRoles,
    ]),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    JwtModule.register({
      global: true,
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    HealthCheck,
    ManageUsersModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [
    AuthUseCase,
    JwtService,
    AuthUserRepository,
    AuthSessionReposiroty,
    ModuleRepository,
    AuthRoleRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'generics/version', method: RequestMethod.ALL },
        { path: 'auth/login', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
