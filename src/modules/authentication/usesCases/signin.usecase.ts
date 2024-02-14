import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { generateDates } from 'src/common/utils/generateDates.utils';
import { generateRandomCode } from 'src/common/utils/randomCode.utils';
import { AuthSessions } from 'src/core/domain/creds_manager.entities/auth_sessions.entity';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';
import { server_envs } from 'src/infrastructure/envs/server.envs';
import { AuthUseCase } from 'src/infrastructure/useCases/authorization/auth.usecase';
import EncryptData from 'src/infrastructure/useCases/encryptation/encryptSitesPasswords.useCases';
import { PasswordAuthEncryptUseCase } from 'src/infrastructure/useCases/encryptation/passwordAuthEncrypt.useCases';
import { DataSource, EntityManager } from 'typeorm';
import { loginDataType } from '../types/login_data.types';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import TwoFactorUseCase from './two_factor.usecase';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly authUseCase: AuthUseCase,
    private readonly authUserRepository: AuthUserRepository,
    private readonly twoFactorUseCase: TwoFactorUseCase,
  ) {}

  async controlUser(email: string): Promise<Partial<AuthUsers>> {
    let userControl: AuthUsers;
    try {
      userControl = await this.authUserRepository.findOne({
        where: {
          email,
        },
        relations: ['credential', 'auth_role', 'auth_role.permissions'],
      });
      if (!userControl) {
        throw new ForbiddenException('Unauthorized access');
      }

      if (!userControl.enable) {
        throw new ForbiddenException('Unauthorized access');
      }
      return userControl;
    } catch (e) {
      throw new ConflictException('Something went wrong')
    }
  }

  async controlPassword(
    password: string,
    hashedPassword: string,
  ): Promise<Partial<void>> {
    const encrypt = new PasswordAuthEncryptUseCase();
    if (!encrypt.comparePassword(password, hashedPassword)) {
      throw new UnauthorizedException('Unauthorized password');
    }
  }

  async generateToken(
    user: Partial<AuthUsers>,
    login_data: loginDataType,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this._dataSource.manager.transaction(
      async (manager: EntityManager) => {
        try {
          // ==== Delete old session ===== //
          const controlSession = await manager.findOne(AuthSessions, {
            where: {
              auth_user: {
                id: user.id,
              },
            },
            relations: ['auth_user'],
          });

          if (controlSession) {
            await manager
              .createQueryBuilder()
              .delete()
              .from(AuthSessions)
              .where('id = :id', { id: controlSession.id })
              .execute();
          }

          // ==== Create Session ===== //
          const { start_date, end_date } = generateDates();
          const session = manager.create(AuthSessions, {
            session_code: generateRandomCode(8),
            authorized: true,
            start_date,
            end_date,
            auth_user: user,
            session_token: '--',
            refresh_session_token: '--',
            ip: login_data.ip,
            user_agent: login_data.userAgent,
          });
          const ss = await manager.save(session);

          // ==== Generate Token ==== //
          const { accessToken, refreshToken } =
            await this.authUseCase.generateJwtToken(ss.id);

          // ==== Save Session ===== //
          await manager
            .createQueryBuilder()
            .update(AuthSessions)
            .set({
              session_token: accessToken,
              refresh_session_token: refreshToken,
            })
            .where('id = :id', { id: ss.id })
            .execute();

          return {
            accessToken,
            refreshToken,
          };
        } catch (e) {
          throw new ConflictException('Some')
          throw new ConflictException('')
        }
      },
    );
  }

  async encryptDataToBeSent(user: Partial<AuthUsers>): Promise<string> {
    try {
      const dataToEncrypt = {
        role_id: user.auth_role.id,
        permission: user.auth_role.permissions,
      };
      const encrypt = new EncryptData(server_envs.encrypt_key);
      const encrypted = await encrypt.encrypt(JSON.stringify(dataToEncrypt));
      return encrypted;
    } catch (e) {
      throw new ConflictException('Some')
    }
  }

  async checkTwoFactorAndSendEmail(user: Partial<AuthUsers>): Promise<boolean> {
    try {
      if (user.two_factor_enabled) {
        const code = await this.twoFactorUseCase.encryptCode(user.id);
        await this.twoFactorUseCase.sendEmail(user.email, code);
        return true;
      }
    } catch (e) {
      throw new ConflictException('Some')
    }
    return false;
  }
}
