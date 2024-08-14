import { Point, Trip } from './trip.entity';

export interface Driver {
  name: string;
  actualLocation: Point;
  trips?: null | Trip[];
}
