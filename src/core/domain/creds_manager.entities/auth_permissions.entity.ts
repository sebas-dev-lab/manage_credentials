import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthRoles } from './auth_roles.entity';
import { AuthModules } from './auth_modules.entity';

@Entity({ name: 'auth_permissions' })
export class AuthPermissions extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AuthRoles, (au) => au.permissions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_role_id' })
  auth_role: AuthRoles;

  @ManyToOne(() => AuthModules, (au) => au.permissions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_module_id' })
  auth_module: AuthModules;
}
