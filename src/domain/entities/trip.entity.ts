import { Driver } from './driver.entity';
import { Invoice } from './invoice.entity';
import { Passenger } from './passenger.entity';

export enum TripStatus {
  'REQUESTED' = 1,
  'ASSIGNED' = 2,
  'ONGOING' = 3,
  'COMPLETED' = 4,
}

export interface Point {
  type?: string;
  coordinates: number[];
}

export interface Trip {
  id?: string;
  origin: Point;
  destination: Point;
  status: TripStatus;
  passenger: string | Passenger;
  driver: string | Driver;
  invoice?: null | Invoice;
}
