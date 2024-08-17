import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TripRepository } from '@Application/repositories/trip.repository';
import { Trip } from '../schemas/trip.schema';
import { BaseMongooseRepository } from './base.repository';
import { RequestTrip, TripStatus } from '@Domain/entities/trip.entity';

@Injectable()
export class MongooseTripRepository
  extends BaseMongooseRepository<Trip>
  implements TripRepository
{
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {
    super(tripModel);
  }

  async findActives(): Promise<Trip[]> {
    return this.tripModel
      .find({
        status: TripStatus.ACCEPT,
      })
      .populate('passenger', 'driver')
      .lean();
  }

  async findByDriver(driverId: string, status: TripStatus[]): Promise<Trip[]> {
    return await this.tripModel
      .find({
        passenger: driverId,
        status: { $in: status },
      })
      .lean();
  }

  async findByPassenger(
    passengerId: string,
    status: TripStatus[],
  ): Promise<Trip[]> {
    return await this.tripModel
      .find({
        passenger: passengerId,
        status: { $in: status },
      })
      .lean();
  }

  async request(passengerId: string, body: RequestTrip): Promise<Trip> {
    return (
      await this.tripModel.create({
        passenger: passengerId,
        ...body,
      })
    ).toJSON();
  }

  async assign(id: string, driverId: string): Promise<Trip> {
    return await this.tripModel
      .findOneAndUpdate(
        { _id: id },
        {
          driver: driverId,
          status: TripStatus.ACCEPT,
        },
        { new: true },
      )
      .lean();
  }

  async complete(id: string): Promise<Trip> {
    return await this.tripModel
      .findOneAndUpdate(
        { _id: id },
        {
          status: TripStatus.COMPLETED,
        },
        { new: true },
      )
      .lean();
  }
}
