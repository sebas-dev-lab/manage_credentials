import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class EntityBase {
  @CreateDateColumn({ nullable: true })
  data_created: Date;

  @UpdateDateColumn({ nullable: true })
  data_modified: Date;

  @DeleteDateColumn({ nullable: true })
  data_deleted: Date;

  @Column({ nullable: true })
  user_created: number;

  @Column({ nullable: true })
  user_modified: number;

  @Column({ nullable: true })
  user_deleted: number;
}
