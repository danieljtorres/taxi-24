import { Driver } from '@Domain/entities/driver.entity';
import { IBaseRepository } from './base.repository';

export abstract class DriverRepository extends IBaseRepository<Driver> {
  abstract findById(id: string): Promise<Driver>;
  abstract findAvailables(): Promise<Driver[]>;
  abstract findAvailablesNearby(location: number[]): Promise<Driver[]>;
}
