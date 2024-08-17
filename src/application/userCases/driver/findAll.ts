import { DriverRepository } from '@Application/repositories/driver.repository';
import { calculatedPages } from '@Utils/pagination';
import { Pagination, PaginationResult } from '@Domain/entities/common.entity';
import { LoggerService } from '@Application/providers/logger.service';
import { Driver } from '@Domain/entities/driver.entity';

export class DriverFindAll {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(pagination: Pagination): Promise<PaginationResult<Driver>> {
    this.logger.info(
      `Starting ${DriverFindAll.name} use case with pagination ${JSON.stringify(pagination)}`,
    );

    const { page, limit } = pagination;

    const count = await this.driverRepository.count();

    const totalPages = calculatedPages(count, limit);

    const drivers = await this.driverRepository.findAll(
      {},
      pagination,
      totalPages,
    );

    return {
      result: drivers,
      page,
      totalPages,
      totalItems: count,
    };
  }
}
