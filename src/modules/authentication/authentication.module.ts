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

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUsers, AuthSessions, AuthModules, AuthRoles]),
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
  ],
  exports: [],
})
export class AuthenticationModule {}
