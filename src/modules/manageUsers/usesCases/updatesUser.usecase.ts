import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRoles } from 'src/core/domain/creds_manager.entities/auth_roles.entity';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import { DataSource } from 'typeorm';
import { UpdateUsersDto } from '../dto/updateUsers.dto';

@Injectable()
export class UpdateUsersUseCase {
  constructor(private _dataSource: DataSource) {}

  async controlUser(user_id: number): Promise<Partial<AuthUsers>> {
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      const userControl = await queryRunner.manager.findOne(AuthUsers, {
        where: {
          id: user_id,
        },
      });
      if (!userControl) {
        throw new ForbiddenException('User not found');
      }
      return userControl;
    } finally {
      await queryRunner.release();
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
    } finally {
      await queryRunner.release();
    }
  }

  async controlEmailExists(email: string): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      const userControl = await queryRunner.manager.findOne(AuthUsers, {
        where: {
          email,
        },
      });
      if (userControl) {
        throw new ForbiddenException('Email already exists');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(
    user_id: number,
    updateUser: Partial<UpdateUsersDto>,
  ): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      const role_id = updateUser?.role_id;
      if (updateUser.role_id) delete updateUser.role_id;

      await queryRunner.manager.update(
        AuthUsers,
        {
          id: user_id,
        },
        {
          ...updateUser,
          ...(role_id && {
            auth_role: {
              id: role_id,
            },
          }),
        },
      );
    } finally {
      await queryRunner.release();
    }
  }
}
