import { Trip } from './trip.entity';

export enum InvoiceStatus {
  'PENDING' = 1,
  'PAID' = 2,
}

export interface Invoice {
  id?: string;
  amount: number;
  rate: number;
  totalDistance: number;
  status: InvoiceStatus;
  trip: string | Trip;
}
