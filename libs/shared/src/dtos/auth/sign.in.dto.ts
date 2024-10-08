import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail } from 'class-validator';

export class SignIn {
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty()
  @IsAlphanumeric()
  @ApiProperty({ required: true })
  password: string;
}
