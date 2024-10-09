import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail } from 'class-validator';

export class SignIn {
  @IsEmail()
  @ApiProperty({ required: true, default: 'iconenemy@gmail.com' })
  email: string;

  @ApiProperty()
  @IsAlphanumeric()
  @ApiProperty({ required: true, default: 'nokia199929' })
  password: string;
}
