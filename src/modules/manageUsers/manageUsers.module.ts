import { Module } from '@nestjs/common';
import { ManageUserServices } from './services/manageUsers.service';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthUsers
        ])
    ],
    providers: [
        ManageUserServices,
        AuthUserRepository,
    ],
    controllers: [],
    exports: [],
})
export class ManageUsersModule { }
