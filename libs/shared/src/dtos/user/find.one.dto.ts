import { FindOperator } from 'typeorm';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

import { User } from '../../entities/user/user.entity';
import { FindReq } from '../../types/find.type';

export class FindOne implements FindReq<User> {
  @IsString()
  @IsOptional()
  id?: string | FindOperator<string>;

  @IsEmail()
  @IsOptional()
  email?: string | FindOperator<string>;

  @IsBoolean()
  is_verified?: boolean | FindOperator<boolean>;
}
