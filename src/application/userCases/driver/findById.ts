import { ExceptionService } from '@Application/providers/exception';
import { LoggerService } from '@Application/providers/logger';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';

export class FindById {
  constructor(
    private driverRepository: DriverRepository,
    private exceptions: ExceptionService,
    private logger: LoggerService,
  ) {}

  async execute(id: string): Promise<DriverPresenter | null> {
    const driver = await this.driverRepository.findById(id);

    return driver ? new DriverPresenter(driver) : null;
  }
}
