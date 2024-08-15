import { Point } from '@Domain/entities/trip.entity';
import { IsArray, IsString } from 'class-validator';

export class PointDTO implements Point {
  @IsString()
  type: string;

  @IsArray()
  coordinates: number[];
}
