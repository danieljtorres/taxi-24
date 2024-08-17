import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TripRepository } from '@Application/repositories/trip.repository';
import { Trip } from '../schemas/trip.schema';
import { BaseMongooseRepository } from './base.repository';

@Injectable()
export class MongooseTripRepository
  extends BaseMongooseRepository<Trip>
  implements TripRepository
{
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {
    super(tripModel);
  }
}
