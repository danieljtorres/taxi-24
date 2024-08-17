import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Passenger as PassengerEntity } from '@Domain/entities/passenger.entity';
import { transformDoc } from '@Utils/mongoose';

export type PassengerDocument = HydratedDocument<Passenger>;

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
export class Passenger implements PassengerEntity {
  @Prop()
  name: string;
}

const PassengerSchema = SchemaFactory.createForClass(Passenger);

PassengerSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'passsenger',
  justOne: false,
});

PassengerSchema.post(['find', 'findOne', 'findOneAndUpdate'], function (res) {
  if (!this.mongooseOptions().lean) {
    return;
  }
  if (Array.isArray(res)) {
    res.forEach(transformDoc);
    return;
  }
  transformDoc(res);
});

export { PassengerSchema };
