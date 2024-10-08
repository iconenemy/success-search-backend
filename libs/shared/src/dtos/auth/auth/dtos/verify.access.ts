import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString } from 'class-validator';

export class VerifyAccess {
  @IsString()
  @IsAlphanumeric()
  @ApiProperty({ required: true })
  accessToken: string;
}
