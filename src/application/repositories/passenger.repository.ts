import { Passenger } from '@Domain/entities/passenger.entity';
import { IBaseRepository } from './base.repository';

export abstract class PassengerRepository extends IBaseRepository<Passenger> {}
