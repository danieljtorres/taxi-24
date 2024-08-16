import { Pagination } from '@Domain/entities/common.entity';

export abstract class IBaseRepository<T> {
  abstract count(query?: Record<string, any>): Promise<number>;
  abstract findAll(pagination: Pagination, totalPages: number): Promise<T[]>;
}
