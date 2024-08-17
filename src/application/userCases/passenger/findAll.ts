import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { calculatedPages } from '@Utils/pagination';
import { Pagination, PaginationResult } from '@Domain/entities/common.entity';
import { LoggerService } from '@Application/providers/logger.service';
import { Passenger } from '@Domain/entities/passenger.entity';

export class PassengerFindAll {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(pagination: Pagination): Promise<PaginationResult<Passenger>> {
    this.logger.info(
      `Starting ${PassengerFindAll.name} use case with pagination ${JSON.stringify(pagination)}`,
    );

    const { page, limit } = pagination;

    const count = await this.passengerRepository.count();

    const totalPages = calculatedPages(count, limit);

    const passengers = await this.passengerRepository.findAll(
      pagination,
      totalPages,
    );

    return {
      result: passengers,
      page,
      totalPages,
      totalItems: count,
    };
  }
}
