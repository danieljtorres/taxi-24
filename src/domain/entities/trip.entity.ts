import { BaseEntity } from './common.entity';
import { Driver } from './driver.entity';
import { Invoice } from './invoice.entity';
import { Passenger } from './passenger.entity';

export enum TripStatus {
  'REQUESTED' = 1,
  'ACCEPT' = 2,
  'COMPLETED' = 3,
}

export interface Location {
  latitude: string | number;
  longitude: string | number;
}

export interface Trip extends BaseEntity {
  id?: string;
  origin: Location;
  destination: Location;
  status: TripStatus;
  passenger: string | Passenger;
  driver?: string | Driver;
  invoice?: null | Invoice;
}

export interface RequestTrip {
  origin: Location;
  destination: Location;
}
