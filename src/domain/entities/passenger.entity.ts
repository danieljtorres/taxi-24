import { BaseEntity } from './common.entity';
import { Trip } from './trip.entity';

export interface Passenger extends BaseEntity {
  name: string;
  trips?: null | Trip[];
}
