import { Trip } from './trip.entity';

export interface Passenger {
  name: string;
  trips?: null | Trip[];
}
