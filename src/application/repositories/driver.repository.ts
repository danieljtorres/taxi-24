import { Driver } from '@Domain/entities/driver.entity';
import { IBaseRepository } from './base.repository';
import { Location } from '@Domain/entities/trip.entity';

export abstract class DriverRepository extends IBaseRepository<Driver> {
  abstract findAvailables(): Promise<Driver[]>;
  abstract findAvailablesNearby(
    location: Location,
    limit?: number,
  ): Promise<Driver[]>;
}
