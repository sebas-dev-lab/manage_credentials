import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUsers } from './auth_users.entity';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';
import { PasswordAuthEncryptUseCase } from 'src/infrastructure/useCases/passwordAuthEncrypt.useCases';
@Entity({ name: 'auth_credentials' })
export class AuthCredentials extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 150 })
  password: string;

  @OneToOne(() => AuthUsers, (au) => au.credential)
  @JoinColumn({ name: 'auth_user_id' })
  auth_user: AuthUsers;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const encrypt = new PasswordAuthEncryptUseCase()
    this.password = await encrypt.hashPassword(this.password);
  } catch(e) {
    Logger.error(e.stack);
  }
}
