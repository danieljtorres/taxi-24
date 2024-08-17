import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Driver as DriverEntity } from '@Domain/entities/driver.entity';
import { Type } from 'class-transformer';
import { Location, Trip } from './trip.schema';
import { transformDoc } from '@Utils/mongoose';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: { getters: true, virtuals: true },
})
export class Driver implements DriverEntity {
  @Prop()
  name: string;

  @Prop({ type: Object })
  actualLocation: Location;

  @Type(() => Trip)
  trips?: Trip[];
}

const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'driver',
});

DriverSchema.post(['find', 'findOne', 'findOneAndUpdate'], function (res) {
  if (!this.mongooseOptions().lean) {
    return;
  }
  if (Array.isArray(res)) {
    res.forEach(transformDoc);
    return;
  }
  transformDoc(res);
});

export { DriverSchema };
