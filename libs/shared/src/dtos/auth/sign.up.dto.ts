import {
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUp {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsAlphanumeric()
  @ApiProperty({ required: true })
  password: string;
}
