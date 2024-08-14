import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Point as PointEntity } from '@Domain/entities/trip.entity';

export class Point extends Document implements PointEntity {
  @Prop({ default: 'Point' })
  type: string;

  @Prop({ default: [0, 0] })
  coordinates: number[];
}
