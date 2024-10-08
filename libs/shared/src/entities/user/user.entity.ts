import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';

import { BaseEntity } from '@libs/common';

import { IUserEntity } from '../../interfaces/user/user.interface';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity implements IUserEntity {
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false, nullable: false })
  is_verified: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
