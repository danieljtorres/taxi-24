import { TripRepository } from '@Application/repositories/trip.repository';
import { calculatedPages } from '@Utils/pagination';
import { Pagination, PaginationResult } from '@Domain/entities/common.entity';
import { LoggerService } from '@Application/providers/logger.service';
import { Trip, TripStatus } from '@Domain/entities/trip.entity';

export class TripFindAllActives {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(pagination: Pagination): Promise<PaginationResult<Trip>> {
    this.logger.info(
      `Starting ${TripFindAllActives.name} use case with pagination ${JSON.stringify(pagination)}`,
    );

    const { page, limit } = pagination;

    const query = { status: TripStatus.ACCEPT };

    const count = await this.tripRepository.count(query);

    const totalPages = calculatedPages(count, limit);

    const trips = await this.tripRepository.findAll(
      query,
      pagination,
      totalPages,
    );

    return {
      result: trips,
      page,
      totalPages,
      totalItems: count,
    };
  }
}
