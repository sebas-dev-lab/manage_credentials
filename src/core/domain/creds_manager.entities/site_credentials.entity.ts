import { EntityBase } from 'src/common/abstracts/base.entity.abstract';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthUsers } from './auth_users.entity';

@Entity({ name: 'site_credentials' })
export class SiteCredentials extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 25 })
  secret: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  site: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  username: string;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @ManyToMany(() => AuthUsers, (user) => user.siteCredentials)
  authUsers: AuthUsers[];
}
