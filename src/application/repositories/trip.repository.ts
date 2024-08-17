import { RequestTrip, Trip, TripStatus } from '@Domain/entities/trip.entity';
import { IBaseRepository } from './base.repository';

export abstract class TripRepository extends IBaseRepository<Trip> {
  abstract findByPassenger(
    passengerId: string,
    status: TripStatus[],
  ): Promise<Trip[]>;
  abstract findByDriver(
    passengerId: string,
    status: TripStatus[],
  ): Promise<Trip[]>;
  abstract request(passengerId: string, body: RequestTrip): Promise<Trip>;
  abstract assign(id: string, driverId: string): Promise<Trip>;
  abstract complete(id: string): Promise<Trip>;
}
