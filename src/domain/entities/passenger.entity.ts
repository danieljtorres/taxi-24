import { Trip } from './trip.entity';

export interface Passenger {
  id?: string;
  name: string;
  trips?: null | Trip[];
}
