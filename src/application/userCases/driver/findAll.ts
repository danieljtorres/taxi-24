import { Injectable } from '@nestjs/common';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { PaginationDTO, PaginationResultDTO } from '@Domain/dtos/common.dto';
import { LoggerService } from '@Application/providers/logger';
import { calculatedPages } from '@Utils/paginate';
import { DriverDTO } from '@Domain/dtos/driver.dto';

@Injectable()
export class FindAll {
  constructor(
    private driverRepository: DriverRepository,
    private logger: LoggerService,
  ) {}

  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginationResultDTO<DriverDTO>> {
    this.logger.info(
      `Starting ${FindAll.name} use case with pagination ${JSON.stringify(pagination)}`,
    );

    const { page, limit } = pagination;

    const count = await this.driverRepository.count();

    const totalPages = calculatedPages(count, limit);

    const drivers = await this.driverRepository.findAll(pagination, totalPages);

    return {
      items: drivers,
      page,
      totalPages,
      totalItems: count,
    };
  }
}
