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
import { transformDoc } from '@Utils/mongoose';

export type TripDocument = HydratedDocument<Trip>;

export class Location implements LocationEntity {
  @Prop({ default: 0 })
  latitude: number;

  @Prop({ default: 0 })
  longitude: number;
}

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: { getters: true, virtuals: true },
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

TripSchema.post(['find', 'findOne', 'findOneAndUpdate'], function (res) {
  if (!this.mongooseOptions().lean) {
    return;
  }
  if (Array.isArray(res)) {
    res.forEach(transformDoc);
    return;
  }
  transformDoc(res);
});

export { TripSchema };
