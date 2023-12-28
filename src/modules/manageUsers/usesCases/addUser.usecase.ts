import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterUsersDto } from '../dto/registerUsers.dto';
import { DataSource, EntityManager } from 'typeorm';
import { AuthCredentials } from 'src/core/domain/creds_manager.entities/auth_credentials.entity';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';
import {
  emailRegex,
  passwordRegex,
} from 'src/common/utils/regex_control.utils';
import { AuthRoles } from 'src/core/domain/creds_manager.entities/auth_roles.entity';

@Injectable()
export class AddUserUseCase {
  constructor(private _dataSource: DataSource) { }

  controlEmailRegex(email: string): void {
    if (!emailRegex.test(email)) {
      throw new ForbiddenException('Invalid email');
    }
  }

  controlPasswordRegex(password: string): void {
    if (!passwordRegex.test(password)) {
      throw new ForbiddenException('Invalid password');
    }
  }


  async controlRoleExists(role_id: number): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      const roleControl = await queryRunner.manager.findOne(AuthRoles, {
        where: {
          id: role_id,
        },
      });
      if (!roleControl) {
        throw new ForbiddenException('Role does not exist');
      }
    } catch (error) {
      console.error('Error during roleControl query:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async controlEmailExists(email: string): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      const userControl = await queryRunner.manager.findOne(AuthUsers, { where: { email } });
      if (userControl) {
        throw new ForbiddenException('User already exists');
      }
    } catch (error) {
      console.error('Error during userControl query:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async addUser(data: RegisterUsersDto): Promise<void> {

    await this._dataSource.manager.transaction(async (manager: EntityManager) => {

      try {


        const roleControl = await manager.findOne(AuthRoles, {
          where: {
            id: data.role_id,
          },
        });

        const authCredential = new AuthCredentials();
        authCredential.password = data.password;
        authCredential.hashPassword();

        const authUser = new AuthUsers();
        authUser.name = data.name;
        authUser.last_name = data.last_name;
        authUser.email = data.email;
        authUser.auth_role = roleControl;

        authUser.credential = authCredential;
        authCredential.auth_user = authUser;
        await authCredential.hashPassword();

        await manager.save(authCredential);
        await manager.save(authUser);
      } catch (e) {
        console.log(e);
      }
    })

  }

}
