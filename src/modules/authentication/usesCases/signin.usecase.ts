import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { generateDates } from "src/common/utils/generateDates.utils";
import { generateRandomCode } from "src/common/utils/randomCode.utils";
import { AuthSessions } from "src/core/domain/creds_manager.entities/auth_sessions.entity";
import { AuthUsers } from "src/core/domain/creds_manager.entities/auth_users.entity";
import Logger from "src/infrastructure/configurations/loggingConfiguration/winston.logs";
import { server_envs } from "src/infrastructure/envs/server.envs";
import { AuthUseCase } from "src/infrastructure/useCases/authorization/auth.usecase";
import EncryptData from "src/infrastructure/useCases/encryptation/encryptSitesPasswords.useCases";
import { PasswordAuthEncryptUseCase } from "src/infrastructure/useCases/encryptation/passwordAuthEncrypt.useCases";
import { DataSource } from "typeorm";
import { loginDataType } from "../types/login_data.types";

@Injectable()
export class SigninUseCase {
    constructor(
        private readonly _dataSource: DataSource,
        private readonly authUseCase: AuthUseCase,
    ) { }

    async controlUser(email: string): Promise<Partial<AuthUsers>> {
        const queryRunner = this._dataSource.createQueryRunner();
        try {
            const userControl = await queryRunner.manager.findOne(
                AuthUsers, {
                where: {
                    email
                },
                relations: [
                    'credential',
                    'auth_role',
                    'auth_role.permissions'
                ]
            }
            );
            if (!userControl) {
                throw new ForbiddenException('Unauthorized access')
            }

            if (!userControl.enable) {
                throw new ForbiddenException('Unauthorized access')
            }

            return userControl
        } finally {
            await queryRunner.release();
        }
    }

    async controlPassword(password: string, hashedPassword: string): Promise<Partial<void>> {
        const encrypt = new PasswordAuthEncryptUseCase();
        if (!encrypt.comparePassword(password, hashedPassword)) {
            throw new UnauthorizedException('Unauthorized password');
        }
    }

    async generateToken(user: Partial<AuthUsers>, login_data: loginDataType): Promise<{ accessToken: string, refreshToken: string }> {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // ==== Delete old session ===== //
            const controlSession = await queryRunner.manager.findOne(AuthSessions, {
                where: {
                    auth_user: {
                        id: user.id,
                    }
                },
                relations: ['auth_user']
            })

            if (controlSession) {
                await queryRunner.manager.delete(AuthSessions, {
                    id: controlSession.id,
                });
             }

            // ==== Creat Session ===== //
            const { start_date, end_date } = generateDates();
            const session = queryRunner.manager.create(
                AuthSessions,
                {
                    session_code: generateRandomCode(8),
                    authorized: true,
                    start_date,
                    end_date,
                    auth_user: user,
                    session_token: '--',
                    refresh_session_token: '--',
                    ip: login_data.ip,
                    user_agent: login_data.userAgent,
                }
            );
            const ss = await queryRunner.manager.save(session);

            // ==== Generate Token ==== //
            const { accessToken, refreshToken } = await this.authUseCase.generateJwtToken(ss.id)

 
            // ==== Save Session ===== //
            await queryRunner.manager.update(AuthSessions, { id: ss.id }, {
                session_token: accessToken,
                refresh_session_token: refreshToken
            });

            // ==== Close connection ===== //
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return {
                accessToken,
                refreshToken,
            }
        } catch (e) {
            Logger.error(e.stack)
            await queryRunner.rollbackTransaction();
        }

    }

    encryptDataToBeSent(user: Partial<AuthUsers>): Promise<string> {
        const dataToEncrypt = {
            role_id: user.auth_role.id,
            permission: user.auth_role.permissions,
        }
        const encrypt = new EncryptData(server_envs.encrypt_key);
        const encrypted = encrypt.encrypt(JSON.stringify(dataToEncrypt));
        return encrypted;
    }
}