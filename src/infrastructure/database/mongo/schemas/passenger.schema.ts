import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Passenger as PassengerEntity } from '@Domain/entities/passenger.entity';

export type PassengerDocument = HydratedDocument<Passenger>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Passenger implements PassengerEntity {
  @Prop()
  name: string;
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);

PassengerSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'passsenger',
  justOne: false,
});
