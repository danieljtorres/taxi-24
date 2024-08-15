import { Point, Trip } from './trip.entity';

export interface Driver {
  id?: string;
  name: string;
  actualLocation: Point;
  trips?: null | Trip[];
}
