import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import { Result } from '@Domain/entities/common.entity';

export class FindAvailables {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<Result<DriverPresenter[]>> {
    this.logger.info(`Starting ${FindAvailables.name} use case}`);

    const drivers = await this.driverRepository.findAvailables();

    return {
      result: drivers.map((driver) => new DriverPresenter(driver)),
    };
  }
}
