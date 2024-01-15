import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PermissionData } from 'src/common/interfaces/permissions.interface';
import { findModulesPermissions } from 'src/common/sql/auth_permissions.sql';
import { AuthRoles } from 'src/core/domain/creds_manager.entities/auth_roles.entity';
import { AuthSessions } from 'src/core/domain/creds_manager.entities/auth_sessions.entity';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import { AuthRoleRepository } from 'src/core/repositories/auth_role.repository';
import { AuthSessionReposiroty } from 'src/core/repositories/auth_session.repository';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { loginDataType } from 'src/modules/authentication/types/login_data.types';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _dataSource: DataSource,
    private readonly authUserRepository: AuthUserRepository,
    private readonly sessionRepository: AuthSessionReposiroty,
    private readonly roleRepository: AuthRoleRepository,
  ) {}

  private async getRoleById(id: number): Promise<AuthRoles> {
    return await this.roleRepository.findOne({
      where: {
        id,
      },
    });
  }

  private async getPermissions(
    id: number,
    ep: string,
  ): Promise<PermissionData[]> {
    const permissions = await this._dataSource.query(
      findModulesPermissions(id, ep),
    );
    return permissions;
  }

  async validateUserByJwt(
    payload: { sid: string },
    login_data: loginDataType,
  ): Promise<{
    user: AuthUsers;
    verify_two_factor: boolean;
    session: AuthSessions;
  }> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: payload.sid,
      },
      relations: ['auth_user'],
    });
    if (!session) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (
      login_data.ip !== session.ip ||
      login_data.userAgent !== session.user_agent
    ) {
      throw new UnauthorizedException('Unauthorized');
    }

    // ===== Control Two Factor ===== //
    const user = await this.authUserRepository.findOne({
      where: {
        id: session.auth_user.id,
      },
      relations: ['auth_role'],
    });

    const verify_two_factor = user.two_factor_enabled;

    return {
      user,
      verify_two_factor,
      session,
    };
  }

  async generateJwtToken(sessionId: string) {
    const payload = { sid: sessionId };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async permissionControl(role_id: number, ep: string): Promise<void> {
    const role = await this.getRoleById(role_id);
    if (!role) {
      throw new ForbiddenException('No access allowed');
    }

    const permissions = await this.getPermissions(role_id, ep);
    if (!permissions || permissions.length === 0) {
      throw new ForbiddenException('No access allowed');
    }
  }

  validateTwoFactor(session: AuthSessions) {
    if (!session.two_factor_authorized) {
      throw new ForbiddenException('No access allowed');
    }
  }
}
