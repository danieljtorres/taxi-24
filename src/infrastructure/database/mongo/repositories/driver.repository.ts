import { Model, PipelineStage } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { Driver } from '../schemas/driver.schema';
import { BaseMongooseRepository } from './base.repository';
import { TripStatus } from '@Domain/entities/trip.entity';
import { getMongoSkip } from '@Utils/pagination';
import { Pagination, SortEnum } from '@Domain/entities/common.entity';
import * as geolib from 'geolib';
import { MAX_DISTANCE_KM } from '@Utils/constants';

@Injectable()
export class MongooseDriverRepository
  extends BaseMongooseRepository<Driver>
  implements DriverRepository
{
  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {
    super(driverModel);
  }

  async findById(id: string): Promise<Driver> {
    return await this.driverModel.findById(id);
  }

  async findAvailables(
    pagination: Pagination,
    totalPages: number,
  ): Promise<Driver[]> {
    const { page, limit, sort } = pagination;

    const skip = getMongoSkip(page, limit, totalPages);

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
                  $in: ['$status', [TripStatus.ASSIGNED, TripStatus.ONGOING]],
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
      { $sort: { name: sort == SortEnum.DESC ? -1 : 1 } },
      {
        $skip: skip,
      },
      {
        $limit: limit,
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

  async findAvailablesNearby(location: number[]): Promise<Driver[]> {
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
                  $in: ['$status', [TripStatus.ASSIGNED, TripStatus.ONGOING]],
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

    const filteredDrivers = drivers.filter(({ actualLocation }) => {
      const [latitude, longitude] = location;
      const [alLatitude, alLongitude] = actualLocation;

      const distanceInKm =
        geolib.getDistance(
          { latitude, longitude },
          { latitude: alLatitude, longitude: alLongitude },
        ) / 1000;

      return distanceInKm <= MAX_DISTANCE_KM;
    });

    return filteredDrivers.map((doc) => this.model.hydrate(doc));
  }
}
