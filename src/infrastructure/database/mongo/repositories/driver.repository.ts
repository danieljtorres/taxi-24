import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRepository } from '@Application/repositories/driver.repository';
import {
  DriverDocument,
  Driver as DriverModel,
} from '../schemas/driver.schema';
import { BaseMongooseRepository } from './base.repository';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { MongooseDriverMapper } from '../mappers/driver.mapper';
import { DriverDTO } from '@Domain/dtos/driver.dto';

@Injectable()
export class MongooseDriverRepository
  extends BaseMongooseRepository<DriverModel, DriverDTO>
  implements DriverRepository
{
  constructor(
    @InjectModel(DriverModel.name) private driverModel: Model<DriverModel>,
  ) {
    super(driverModel);
  }

  override async findAll(
    pagination: PaginationDTO,
    totalPages: number,
  ): Promise<DriverDTO[]> {
    const drivers = await super.findAll(pagination, totalPages);

    return MongooseDriverMapper.arrayToResponse(drivers as DriverDocument[]);
  }
}
