import { Trip } from '@Domain/entities/trip.entity';
import { IBaseRepository } from './base.repository';

export abstract class TripRepository extends IBaseRepository<Trip> {}
