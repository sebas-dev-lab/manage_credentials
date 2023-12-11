import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AuthCredentials } from './auth_credentials.entity';
import { AuthSessions } from './auth_sessions.entity';
import { SiteCredentials } from './site_credentials.entity';

@Entity({ name: 'auth_users' })
@Unique(['email']) // Unique constraint
export class AuthUsers extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  last_name: string;

  @OneToOne(() => AuthCredentials, (cred) => cred.auth_user, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_credential_id' })
  credential: AuthCredentials;

  @OneToMany(() => AuthSessions, (as) => as.auth_user)
  sessions: AuthSessions[];

  @ManyToMany(() => SiteCredentials, { cascade: true })
  @JoinTable({ name: 'users_site_credentials' })
  siteCredentials: SiteCredentials[];
}
