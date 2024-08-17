import { BaseEntity } from './common.entity';
import { Location, Trip } from './trip.entity';

export interface Driver extends BaseEntity {
  name: string;
  actualLocation: Location;
  trips?: null | Trip[];
}
