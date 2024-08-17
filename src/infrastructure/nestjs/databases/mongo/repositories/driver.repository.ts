import { Model, PipelineStage } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { Driver } from '../schemas/driver.schema';
import { BaseMongooseRepository } from './base.repository';
import { Location, TripStatus } from '@Domain/entities/trip.entity';
import { getDistance } from '@Utils/geo';
import { MAX_DISTANCE_KM } from '@Utils/constants';

@Injectable()
export class MongooseDriverRepository
  extends BaseMongooseRepository<Driver>
  implements DriverRepository
{
  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {
    super(driverModel);
  }

  async findAvailables(): Promise<Driver[]> {
    const aggregation: PipelineStage[] = [
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'driver',
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$status', [TripStatus.ASSIGNED]],
                },
              },
            },
          ],
          as: 'trips',
        },
      },
      {
        $match: { trips: { $gt: { $size: 0 } } },
      },
      {
        $project: {
          trips: 0,
        },
      },
    ];

    return (await this.driverModel.aggregate(aggregation)).map((doc) =>
      this.model.hydrate(doc),
    );
  }

  async findAvailablesNearby(
    location: Location,
    limit?: number,
  ): Promise<Driver[]> {
    const aggregation: PipelineStage[] = [
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'driver',
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$status', [TripStatus.ASSIGNED]],
                },
              },
            },
          ],
          as: 'trips',
        },
      },
      {
        $match: { trips: { $gt: { $size: 0 } } },
      },
    ];

    const drivers = await this.driverModel.aggregate(aggregation);

    const filteredDrivers = drivers
      .filter(
        ({ actualLocation }: Driver) =>
          getDistance(actualLocation, location) <= MAX_DISTANCE_KM,
      )
      .sort(
        (a, b) =>
          getDistance(a.actualLocation, location) -
          getDistance(b.actualLocation, location),
      )
      .map((doc) => this.model.hydrate(doc));

    if (limit) return filteredDrivers.slice(0, limit);

    return filteredDrivers;
  }
}
