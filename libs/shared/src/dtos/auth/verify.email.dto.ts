import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmail {
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;
}
