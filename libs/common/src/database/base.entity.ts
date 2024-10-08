import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

import { IBaseEntity } from './base.entity.interface';

@Entity()
export class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
