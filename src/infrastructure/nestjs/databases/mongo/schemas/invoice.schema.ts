import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Type } from 'class-transformer';
import {
  Invoice as InvoiceEntity,
  InvoiceStatus,
} from '@Domain/entities/invoice.entity';
import { Trip } from './trip.schema';
import { RATE_PER_KM } from '@Utils/constants';

export type InvoiceDocument = HydratedDocument<Invoice>;

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
export class Invoice implements InvoiceEntity {
  @Prop()
  amount: number;

  @Prop({ default: RATE_PER_KM })
  rate: number;

  @Prop({ default: 0 })
  totalDistance: number;

  @Prop({ default: InvoiceStatus.PENDING })
  status: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' })
  @Type(() => Trip)
  trip: Trip;
}

const InvoiceSchema = SchemaFactory.createForClass(Invoice);

export { InvoiceSchema };
