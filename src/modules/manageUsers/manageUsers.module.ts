import { Module } from '@nestjs/common';
import { SearchUsersServices } from './services/searchUsers.service';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import { ManageUsersControllers } from './controllers/manageUsers.controller';
import { ManageUserServices } from './services/manageUsers.service';
import { AuthCredentialsRepository } from 'src/core/repositories/auth_credentials.repository';
import { AuthCredentials } from 'src/core/domain/creds_manager.entities/auth_credentials.entity';
import { AddUserUseCase } from './usesCases/addUser.usecase';
import { UpdateUsersUseCase } from './usesCases/updatesUser.usecase';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthUsers,
            AuthCredentials,
        ])
    ],
    providers: [
        SearchUsersServices,
        ManageUserServices,
        AuthUserRepository,
        AuthCredentialsRepository,
        AddUserUseCase,
        UpdateUsersUseCase,
    ],
    controllers: [ManageUsersControllers],
    exports: [],
})
export class ManageUsersModule { }
