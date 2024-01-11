import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/infrastructure/useCases/authorization/jwt.strategy.usecase';
import { AuthController } from './controllers/auth.controllers';
import { AuthUseCase } from 'src/infrastructure/useCases/authorization/auth.usecase';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { AuthSessionReposiroty } from 'src/core/repositories/auth_session.repository';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import { AuthSessions } from 'src/core/domain/creds_manager.entities/auth_sessions.entity';
import { SigninUseCase } from './usesCases/signin.usecase';
import { SigninAuthenticationService } from './services/signin.service';
import { ModuleRepository } from 'src/core/repositories/auth_module.resporitory';
import { AuthModules } from 'src/core/domain/creds_manager.entities/auth_modules.entity';
import { AuthRoleRepository } from 'src/core/repositories/auth_role.repository';
import { AuthRoles } from 'src/core/domain/creds_manager.entities/auth_roles.entity';
import TwoFactorUseCase from './usesCases/two_factor.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitmq_envs } from 'src/infrastructure/envs/server.envs';
import { NOTIFICATION_SERVICE } from 'src/infrastructure/services/constants/services.constant';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUsers, AuthSessions, AuthModules, AuthRoles]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (consfigService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [{
              port: Number(rabbitmq_envs.port),
              hostname: rabbitmq_envs.hostname,
              password: rabbitmq_envs.password,
              username: rabbitmq_envs.username,
            }],
            queue: rabbitmq_envs.queue,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthUseCase,
    AuthUserRepository,
    AuthSessionReposiroty,
    SigninUseCase,
    SigninAuthenticationService,
    ModuleRepository,
    AuthRoleRepository,
    TwoFactorUseCase,
  ],
  exports: [],
})
export class AuthenticationModule {}
