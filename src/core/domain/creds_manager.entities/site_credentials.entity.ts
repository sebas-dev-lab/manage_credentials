import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUsers } from './auth_users.entity';
import { HanshAndEncryptData } from 'src/infrastructure/useCases/encryptation/encryptSitesPasswords.useCases';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';

@Entity({ name: 'site_credentials' })
export class SiteCredentials extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  secret: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  ivp: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  site: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  username: string;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @ManyToMany(() => AuthUsers)
  @JoinTable({ name: 'users_site_credentials' })
  authUsers: AuthUsers[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const encrypt = new HanshAndEncryptData(this.secret);
    const { iv, encrypted } = await encrypt.encryptData();
    this.secret = encrypted;
    this.ivp = iv;
  }
  catch(e: any) {
    Logger.error(e.stack);
  }
}
