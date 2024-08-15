import { PaginationDTO } from '@Domain/dtos/common.dto';

export abstract class IBaseRepository<T> {
  abstract count(query?: Record<string, any>): Promise<number>;
  abstract findAll(pagination: PaginationDTO, totalPages: number): Promise<T[]>;
}
