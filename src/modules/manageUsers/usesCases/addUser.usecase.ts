import { ForbiddenException, Injectable } from "@nestjs/common";
import { RegisterUsersDto } from "../dto/registerUsers.dto";
import { DataSource } from "typeorm";
import { AuthCredentials } from "src/core/domain/creds_manager.entities/auth_credentials.entity";
import { AuthUsers } from "src/core/domain/creds_manager.entities/auth_users.entity";
import Logger from "src/infrastructure/configurations/loggingConfiguration/winston.logs";
import { emailRegex, passwordRegex } from "src/common/utils/regex_control.utils";
import { AuthRoles } from "src/core/domain/creds_manager.entities/auth_roles.entity";

@Injectable()
export class AddUserUseCase {

    constructor(private _dataSource: DataSource) { }

    controlEmailRegex(email: string): void {
        if (!emailRegex.test(email)) {
            throw new ForbiddenException('Invalid email')
        }
    }

    controlPassword(password: string): void {
        if (!passwordRegex.test(password)) {
            throw new ForbiddenException('Invalid password')
        }
    }

    async controlRole(role_id: number): Promise<void> {
        const queryRunner = this._dataSource.createQueryRunner();
        try {
            const roleControl = await queryRunner.manager.findOne(
                AuthRoles, {
                where: {
                    id: role_id,
                }
            }
            );
            if (!roleControl) {
                throw new ForbiddenException('Role does not exist')
            }
        } finally {
            await queryRunner.release();
        }
    }

    async controlEmailExists(email: string): Promise<void> {
        const queryRunner = this._dataSource.createQueryRunner();
        try {
            const userControl = await queryRunner.manager.findOne(
                AuthUsers, {
                where: {
                    email
                }
            }
            );
            if (userControl) {
                throw new ForbiddenException('User already exists')
            }
        } finally {
            await queryRunner.release();
        }
    }

    async addUser(data: RegisterUsersDto): Promise<void> {
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const authCredential = queryRunner.manager.create(
                AuthCredentials, {
                password: data.password,
            });
            const authUser = queryRunner.manager.create(
                AuthUsers, {
                name: data.name,
                last_name: data.last_name,
                email: data.email,
            }
            )

            authUser.credential = authCredential;
            authCredential.auth_user = authUser;

            await queryRunner.manager.save(authCredential);
            await queryRunner.manager.save(authUser);

            await queryRunner.commitTransaction();
            await queryRunner.release();
        } catch (e) {
            Logger.error(e.stack)
            await queryRunner.rollbackTransaction();
        }

    }

}