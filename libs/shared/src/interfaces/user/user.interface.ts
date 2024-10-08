import { IBaseEntity } from '@libs/common';

export interface IUserEntity extends IBaseEntity {
  email: string;
  password: string;
  is_verified: boolean;
}
