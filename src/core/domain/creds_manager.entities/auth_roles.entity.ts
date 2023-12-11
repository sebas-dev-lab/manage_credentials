import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthPermissions } from './auth_permissions.entity';
import { AuthUsers } from './auth_users.entity';

@Entity({ name: 'auth_roles' })
export class AuthRoles extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  description: string;

  @OneToMany(() => AuthPermissions, (as) => as.auth_module)
  permissions: AuthPermissions[];

  @OneToMany(() => AuthUsers, (as) => as.auth_role)
  auth_users: AuthUsers[];
}
