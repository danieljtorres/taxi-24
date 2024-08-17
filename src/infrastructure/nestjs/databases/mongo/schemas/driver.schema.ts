import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Driver as DriverEntity } from '@Domain/entities/driver.entity';
import { Type } from 'class-transformer';
import { Trip } from './trip.schema';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
})
export class Driver implements DriverEntity {
  _id?: string;

  @Prop()
  name: string;

  @Prop({ default: [0, 0] })
  actualLocation: number[];

  @Type(() => Trip)
  trips?: Trip[];
}

const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'driver',
});

export { DriverSchema };
