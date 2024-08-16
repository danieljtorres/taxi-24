import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';

export class FindAvailablesNearby {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(location: number[]): Promise<DriverPresenter[]> {
    this.logger.info(
      `Starting ${FindAvailablesNearby.name} use case with pagination ${JSON.stringify({ location })}`,
    );

    const drivers = await this.driverRepository.findAvailablesNearby(location);

    return drivers.map((driver) => new DriverPresenter(driver));
  }
}
