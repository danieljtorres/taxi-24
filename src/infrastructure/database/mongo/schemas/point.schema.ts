import { Prop } from '@nestjs/mongoose';
import { Point as PointEntity } from '@Domain/entities/trip.entity';

export class Point implements PointEntity {
  @Prop({ default: 'Point' })
  type?: string;

  @Prop({ default: [0, 0] })
  coordinates: number[];
}
