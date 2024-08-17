import { BaseEntity } from './common.entity';
import { Location, Trip } from './trip.entity';

export interface Driver extends BaseEntity {
  id?: string;
  name: string;
  actualLocation: Location;
  trips?: null | Trip[];
}
