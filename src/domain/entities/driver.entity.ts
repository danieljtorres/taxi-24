import { Trip } from './trip.entity';

export interface Driver {
  id?: string;
  name: string;
  actualLocation: number[];
  trips?: null | Trip[];
  createdAt?: Date;
  updatedAt?: Date;
}
