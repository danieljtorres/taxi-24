import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Type } from 'class-transformer';
import { Trip as TripEntity, TripStatus } from '@Domain/entities/trip.entity';
import { Passenger } from './passenger.schema';
import { Driver } from './driver.schema';
import { Point } from './point.schema';

export type TripDocument = HydratedDocument<Trip>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Trip implements TripEntity {
  @Prop()
  origin: Point;

  @Prop()
  destination: Point;

  @Prop({ default: TripStatus.REQUESTED })
  status: TripStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Passenger.name })
  @Type(() => Passenger)
  passenger: Passenger;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name })
  @Type(() => Driver)
  driver: Driver;
}

export const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.virtual('invoice', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'trip',
  justOne: true,
});

TripSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
