import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger';
import { calculatedPages } from '@Utils/pagination';
import { Pagination, PaginationResult } from '@Domain/entities/common.entity';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';

export class FindAvailables {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    pagination: Pagination,
  ): Promise<PaginationResult<DriverPresenter>> {
    this.logger.info(
      `Starting ${FindAvailables.name} use case with pagination ${JSON.stringify({ ...pagination, location })}`,
    );

    const { page, limit } = pagination;

    const count = await this.driverRepository.count();

    const totalPages = calculatedPages(count, limit);

    const drivers = await this.driverRepository.findAvailables(
      pagination,
      totalPages,
    );

    return {
      result: drivers.map((driver) => new DriverPresenter(driver)),
      page,
      totalPages,
      totalItems: count,
    };
  }
}
