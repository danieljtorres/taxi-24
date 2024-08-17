import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { Result } from '@Domain/entities/common.entity';
import { Driver } from '@Domain/entities/driver.entity';

export class DriverFindAvailables {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<Result<Driver[]>> {
    this.logger.info(`Starting ${DriverFindAvailables.name} use case}`);

    const drivers = await this.driverRepository.findAvailables();

    return {
      result: drivers,
    };
  }
}
