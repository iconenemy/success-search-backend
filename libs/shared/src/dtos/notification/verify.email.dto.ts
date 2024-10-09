import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class VerifyEmail {
  @IsAlphanumeric()
  @ApiProperty({ required: true })
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsNumber()
  @ApiProperty({ required: true })
  code: number;
}
