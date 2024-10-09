import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Model } from '@libs/shared';
import { BaseRepository } from '@libs/common/database/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<Model.User> {
  constructor(
    @InjectRepository(Model.User)
    private readonly userRepository: Repository<Model.User>,
  ) {
    super(userRepository);
  }

  async update(
    id: string,
    updatedData: Partial<Pick<Model.User, 'password' | 'is_verified'>>,
  ) {
    return this.userRepository.update(id, updatedData);
  }
}
