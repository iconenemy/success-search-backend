import {
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Update {
  @IsAlphanumeric()
  @ApiProperty({ required: true })
  id: string;

  @IsAlphanumeric()
  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  password?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  is_verified?: boolean;
}
