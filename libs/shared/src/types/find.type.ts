import { FindOptionsWhere } from 'typeorm';

export type FindReq<T> = FindOptionsWhere<
  Omit<T, 'updated_at' | 'created_at' | 'password' | 'hashPassword'>
>;

export type FindOneRes<T> = T | null;

export type FindAllRes<T> = Array<T>;
