import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PermissionData } from 'src/common/interfaces/permissions.interface';
import { findModulesPermissions } from 'src/common/sql/auth_permissions.sql';
import { AuthRoles } from 'src/core/domain/creds_manager.entities/auth_roles.entity';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import { AuthRoleRepository } from 'src/core/repositories/auth_role.repository';
import { AuthSessionReposiroty } from 'src/core/repositories/auth_session.repository';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthUseCase {
    constructor(
        private readonly jwtService: JwtService,
        private readonly _dataSource: DataSource,
        private readonly authUserRepository: AuthUserRepository,
        private readonly sessionRepository: AuthSessionReposiroty,
        private readonly roleRepository: AuthRoleRepository,
    ) { }

    private async getRoleById(id: number): Promise<AuthRoles> {
        return this.roleRepository.findOne({
            where: {
                id,
            },
        });
    }

    private async getPermissions(id: number, ep: string): Promise<PermissionData[]> {
        const queryRunner = this._dataSource.createQueryRunner();
        try {
            const permissions = await queryRunner.manager.query(
                findModulesPermissions(id, ep)
            );
            return permissions;
        } finally {
            await queryRunner.release();
        }

    }

    async validateUserByJwt(payload: { sid: string }): Promise<AuthUsers> {
        const sessionId = await this.sessionRepository.findOne({
            where: {
                id: payload.sid
            },
            relations: ['auth_user']
        });
        if (!sessionId) {
            throw new UnauthorizedException('Unauthorized');
        }
        return await this.authUserRepository.findOne({
            where: {
                id: sessionId.auth_user.id,
            },
            relations: ['auth_role']
        })
    }

    async generateJwtToken(sessionId: string) {
        const payload = { sid: sessionId };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload);
        return { accessToken, refreshToken };
    }

    async validateRefreshToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
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
}
