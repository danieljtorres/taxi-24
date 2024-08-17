import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { Result } from '@Domain/entities/common.entity';
import { Driver } from '@Domain/entities/driver.entity';
import { Location } from '@Domain/entities/trip.entity';

export class DriverFindAvailablesNearby {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(location: Location): Promise<Result<Driver[]>> {
    this.logger.info(
      `Starting ${DriverFindAvailablesNearby.name} use case with pagination ${JSON.stringify({ location })}`,
    );

    const drivers = await this.driverRepository.findAvailablesNearby(location);

    return {
      result: drivers,
    };
  }
}
