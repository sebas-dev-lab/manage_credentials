import { ConflictException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { generateRandomCode } from "src/common/utils/randomCode.utils";
import { AuthSessions } from "src/core/domain/creds_manager.entities/auth_sessions.entity";
import { AuthSessionReposiroty } from "src/core/repositories/auth_session.repository";
import Logger from "src/infrastructure/configurations/loggingConfiguration/winston.logs";
import { NOTIFICATION_SERVICE, auth_email_code } from "src/infrastructure/services/constants/services.constant";
import { PasswordAuthEncryptUseCase } from "src/infrastructure/useCases/encryptation/passwordAuthEncrypt.useCases";

@Injectable()
export default class TwoFactorUseCase {

    constructor(
        @Inject(NOTIFICATION_SERVICE) private readonly client: ClientProxy,
        private readonly authSessionRepository: AuthSessionReposiroty,
    ) {
        this.client.connect();
    }


    private generateCode(): string {
        return generateRandomCode(8);
    }

    private async encrytpTwoFactorCode(code): Promise<string> {
        const encrypt = new PasswordAuthEncryptUseCase();
        return await encrypt.hashPassword(code);
    }

    public async encryptCode(user_id: number): Promise<string> {
        try {
            const session = await this.authSessionRepository.findOne({
                where: {
                    auth_user: {
                        id: user_id,
                    }
                }
            });

            if (!session) {
                throw new ConflictException('No auth session found');
            }
            const code = this.generateCode();
            const factor = await this.encrytpTwoFactorCode(code);

            await this.authSessionRepository.repository.manager.createQueryBuilder()
                .update(AuthSessions)
                .set({
                    two_factor_authorized: false,
                    two_factor_code: factor,
                })
                .where('auth_user_id = :auth_user_id', { auth_user_id: user_id })
                .execute();
            
            return code;
        } catch (e) {
            Logger.error(e.stack);
        }
    }

    public async sendEmail(email: string, code: string): Promise<void> {
        try {
            this.client.emit(auth_email_code, {
                message: {
                    code,
                    email,
                    template: 'two_factor_auth_template',
                    to: email,
                    text: code,
                    subject: 'Validación de segundo factor',
                    from: 'no-reply@dingtech.com.ar',
                }
            });
        } catch (e) {
            Logger.error(e.stack);
        }
    }

}