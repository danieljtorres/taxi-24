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
    return this.tripModel.find({
      status: TripStatus.ASSIGNED,
    });
  }

  async findByDriver(driverId: string, status: TripStatus[]): Promise<Trip[]> {
    return this.tripModel.find({
      passenger: driverId,
      status: { $in: status },
    });
  }

  async findByPassenger(
    passengerId: string,
    status: TripStatus[],
  ): Promise<Trip[]> {
    return this.tripModel.find({
      passenger: passengerId,
      status: { $in: status },
    });
  }

  async request(passengerId: string, body: RequestTrip): Promise<Trip> {
    return this.tripModel.create({
      passenger: passengerId,
      ...body,
    });
  }

  async assign(id: string, driverId: string): Promise<Trip> {
    return this.tripModel.findOneAndUpdate(
      { _id: id },
      {
        driver: driverId,
      },
    );
  }

  async complete(id: string): Promise<Trip> {
    return this.tripModel.findOneAndUpdate(
      { _id: id },
      {
        status: TripStatus.COMPLETED,
      },
    );
  }
}
