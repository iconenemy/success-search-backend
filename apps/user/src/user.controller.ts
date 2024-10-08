import { FindOptionsWhere } from 'typeorm';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserRepository } from './user.repository';
import { Pattern, DTO } from '@libs/shared';

@Controller()
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @MessagePattern({ cmd: Pattern.User.FindOne })
  findOne(@Payload() dto: DTO.User.FindOne) {
    return this.userRepository.findOne(dto);
  }

  @MessagePattern({ cmd: Pattern.User.Create })
  create(@Payload() dto: DTO.Auth.SignUp) {
    return this.userRepository.create(dto);
  }
}
