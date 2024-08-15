import { DriverDocument } from '../schemas/driver.schema';
import { Mapper } from './mapper';
import { DriverDTO } from '@Domain/dtos/driver.dto';
import { PointDTO } from '@Domain/dtos/point.dto';

export class MongooseDriverMapper implements Mapper {
  static toResponse(document: DriverDocument): DriverDTO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, actualLocation, ...rest } = document;

    return {
      id: _id,
      actualLocation: actualLocation as PointDTO,
      ...rest,
    };
  }

  static arrayToResponse(documents: DriverDocument[]): DriverDTO[] {
    return documents.map(MongooseDriverMapper.toResponse);
  }
}
