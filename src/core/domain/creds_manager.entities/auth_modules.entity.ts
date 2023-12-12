import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthPermissions } from './auth_permissions.entity';

@Entity({ name: 'auth_modules' })
export class AuthModules extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  description: string;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  endpoint: string;

  @OneToMany(() => AuthPermissions, (as) => as.auth_module)
  permissions: AuthPermissions[];
}
