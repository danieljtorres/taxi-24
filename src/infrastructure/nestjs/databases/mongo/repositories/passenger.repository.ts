import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { Passenger } from '../schemas/passenger.schema';
import { BaseMongooseRepository } from './base.repository';

@Injectable()
export class MongoosePassengerRepository
  extends BaseMongooseRepository<Passenger>
  implements PassengerRepository
{
  constructor(
    @InjectModel(Passenger.name)
    private passengerModel: Model<Passenger>,
  ) {
    super(passengerModel);
  }
}
