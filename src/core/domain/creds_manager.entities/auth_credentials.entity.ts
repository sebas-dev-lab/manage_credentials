import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUsers } from './auth_users.entity';

@Entity({ name: 'auth_credentials' })
export class AuthCredentials extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 25 })
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  ivp: string;

  @OneToOne(() => AuthUsers, (au) => au.credential)
  @JoinColumn({ name: 'auth_user_id' })
  auth_user: AuthUsers;
}
