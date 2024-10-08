import { Injectable } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';

import { IBaseRepository } from './base.repository.interface';

@Injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(filter?: FindManyOptions<T>): Promise<Array<T>> {
    return this.repository.find(filter);
  }

  async findOne(filter: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(filter);
  }

  async remove(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
