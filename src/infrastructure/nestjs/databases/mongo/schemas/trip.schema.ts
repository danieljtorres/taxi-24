import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Type } from 'class-transformer';
import {
  Location as LocationEntity,
  Trip as TripEntity,
  TripStatus,
} from '@Domain/entities/trip.entity';
import { Passenger } from './passenger.schema';
import { Driver } from './driver.schema';

export type TripDocument = HydratedDocument<Trip>;

export class Location implements LocationEntity {
  @Prop({ default: 0 })
  latitude: number;

  @Prop({ default: 0 })
  longitude: number;
}

@Schema({
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  versionKey: false,
  id: true,
})
export class Trip implements TripEntity {
  @Prop({ type: Object })
  origin: Location;

  @Prop({ type: Object })
  destination: Location;

  @Prop({ default: TripStatus.REQUESTED })
  status: TripStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Passenger.name,
    default: null,
  })
  @Type(() => Passenger)
  passenger: Passenger;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Driver.name,
    default: null,
  })
  @Type(() => Driver)
  driver: Driver;
}

const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.virtual('invoice', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'trip',
  justOne: true,
});

export { TripSchema };
