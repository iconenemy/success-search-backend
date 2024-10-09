import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmail {
  @IsNumber()
  @ApiProperty({ required: true })
  code: number;
}
