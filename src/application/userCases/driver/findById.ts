import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { Driver } from '@Domain/entities/driver.entity';
import { ResultPresenter } from '@Domain/presenters/common';

export class DriverFindById {
  constructor(
    private driverRepository: DriverRepository,
    private logger: LoggerService,
  ) {}

  async execute(id: string): Promise<ResultPresenter<Driver | null>> {
    this.logger.info(
      `Starting ${DriverFindById.name} use case with driver id: ${id}`,
    );

    const driver = await this.driverRepository.findById(id);

    return {
      result: driver ?? null,
    };
  }
}
