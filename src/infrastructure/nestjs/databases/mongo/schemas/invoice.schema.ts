import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Type } from 'class-transformer';
import {
  Invoice as InvoiceEntity,
  InvoiceStatus,
} from '@Domain/entities/invoice.entity';
import { Trip } from './trip.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  versionKey: false,
  id: true,
})
export class Invoice implements InvoiceEntity {
  @Prop()
  amount: number;

  @Prop({ default: InvoiceStatus.PENDING })
  status: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' })
  @Type(() => Trip)
  trip: Trip;
}

const InvoiceSchema = SchemaFactory.createForClass(Invoice);

export { InvoiceSchema };
