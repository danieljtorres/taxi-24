import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InvoiceRepository } from '@Application/repositories/invoice.repository';
import { Invoice } from '../schemas/invoice.schema';
import { BaseMongooseRepository } from './base.repository';

@Injectable()
export class MongooseInvoiceRepository
  extends BaseMongooseRepository<Invoice>
  implements InvoiceRepository
{
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) {
    super(invoiceModel);
  }

  async create(data: any): Promise<Invoice> {
    return (await this.invoiceModel.create(data)).toJSON();
  }
}
