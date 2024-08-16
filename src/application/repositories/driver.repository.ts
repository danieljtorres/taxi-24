import { Driver } from '@Domain/entities/driver.entity';
import { IBaseRepository } from './base.repository';
import { Pagination } from '@Domain/entities/common.entity';

export abstract class DriverRepository extends IBaseRepository<Driver> {
  abstract findById(id: string): Promise<Driver>;
  abstract findAvailables(
    pagination: Pagination,
    totalPages: number,
  ): Promise<Driver[]>;
  abstract findAvailablesNearby(location: number[]): Promise<Driver[]>;
}
