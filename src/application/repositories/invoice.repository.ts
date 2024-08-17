import { Invoice } from '@Domain/entities/invoice.entity';
import { IBaseRepository } from './base.repository';

export abstract class InvoiceRepository extends IBaseRepository<Invoice> {
  abstract create(data: any): Promise<Invoice>;
}
