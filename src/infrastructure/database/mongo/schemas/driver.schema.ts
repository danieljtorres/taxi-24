import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Driver as DriverEntity } from '@Domain/entities/driver.entity';
import { Type } from 'class-transformer';
import { Point } from './point.schema';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Driver implements DriverEntity {
  @Prop()
  name: string;

  @Prop()
  @Type(() => Point)
  actualLocation: Point;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'driver',
  justOne: false,
});
