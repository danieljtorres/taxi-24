import { Pagination } from '@Domain/entities/common.entity';

export abstract class IBaseRepository<T> {
  abstract count(query?: Record<string, any>): Promise<number>;
  abstract findById(id: string): Promise<T>;
  abstract findAll(pagination: Pagination, totalPages: number): Promise<T[]>;
}
