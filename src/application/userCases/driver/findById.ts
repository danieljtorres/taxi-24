import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { ResultPresenter } from '@Domain/presenters/common';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';

export class FindById {
  constructor(
    private driverRepository: DriverRepository,
    private logger: LoggerService,
  ) {}

  async execute(id: string): Promise<ResultPresenter<DriverPresenter> | null> {
    this.logger.info(
      `Starting ${FindById.name} use case with driver id: ${id}`,
    );

    const driver = await this.driverRepository.findById(id);

    return {
      result: driver ? new DriverPresenter(driver) : null,
    };
  }
}
