import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendCode {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
