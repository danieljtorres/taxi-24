import { BaseEntity } from './common.entity';
import { Trip } from './trip.entity';

export interface Passenger extends BaseEntity {
  id?: string;
  name: string;
  trips?: null | Trip[];
}
