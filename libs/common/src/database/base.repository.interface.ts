import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface IBaseRepository<T> {
  create: (dto: DeepPartial<T>) => Promise<T>;

  findAll: (filter?: FindManyOptions<T>) => Promise<Array<T>>;

  findOne: (filter: FindOptionsWhere<T>) => Promise<T | null>;

  remove: (id: string) => Promise<void>;
}
