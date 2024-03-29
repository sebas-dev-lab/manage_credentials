import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUsers } from './auth_users.entity';

@Entity({ name: 'auth_sessions' })
export class AuthSessions extends EntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'text' })
  session_token: string;

  @Column({ nullable: false, type: 'text' })
  refresh_session_token: string;

  @Column({ nullable: false, type: 'varchar', length: 25 })
  session_code: string;

  @Column({ nullable: false, type: 'bool', default: false })
  authorized: boolean;

  @Column({ nullable: false, type: 'bool', default: false })
  two_factor_authorized: boolean; 

  @Column({ nullable: true, type: 'varchar', length: 200 })
  two_factor_code: string;

  @Column({ nullable: false, type: 'timestamp' })
  start_date: Date;

  @Column({ nullable: false, type: 'timestamp' })
  end_date: Date;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  ip: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  user_agent: string;

  @ManyToOne(() => AuthUsers, (au) => au.sessions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_user_id' })
  auth_user: AuthUsers;
}
