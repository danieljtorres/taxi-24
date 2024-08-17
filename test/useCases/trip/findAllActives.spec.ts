import { TripRepository } from '@Application/repositories/trip.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { Pagination, PaginationResult } from '@Domain/entities/common.entity';
import { Trip, TripStatus } from '@Domain/entities/trip.entity';
import { TripFindAllActives } from '@Application/userCases/trips/findAllActives';

describe('TripFindAllActives', () => {
  let tripFindAllActives: TripFindAllActives;
  let mockTripRepository: TripRepository;
  let mockLogger: LoggerService;

  beforeEach(() => {
    mockTripRepository = {
      count: jest.fn(),
      findAll: jest.fn(),
    } as unknown as TripRepository;

    mockLogger = {
      info: jest.fn(),
    } as unknown as LoggerService;

    tripFindAllActives = new TripFindAllActives(mockTripRepository, mockLogger);
  });

  it('should return a paginated result of active trips', async () => {
    const pagination: Pagination = { page: 1, limit: 10 };
    const trips: Trip[] = [
      {
        id: '1',
        status: TripStatus.ACCEPT,
        origin: undefined,
        destination: undefined,
        passenger: '',
      },
      {
        id: '2',
        status: TripStatus.ACCEPT,
        origin: undefined,
        destination: undefined,
        passenger: '',
      },
    ];

    (mockTripRepository.count as jest.Mock).mockResolvedValue(2);
    (mockTripRepository.findAll as jest.Mock).mockResolvedValue(trips);

    const result: PaginationResult<Trip> =
      await tripFindAllActives.execute(pagination);

    expect(mockTripRepository.count).toHaveBeenCalledWith({
      status: TripStatus.ACCEPT,
    });
    expect(mockTripRepository.findAll).toHaveBeenCalledWith(
      { status: TripStatus.ACCEPT },
      pagination,
      1, // totalPages calculated based on 2 items with limit 10
    );
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toBe(trips);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.totalItems).toBe(2);
  });

  it('should return empty result if no active trips are found', async () => {
    const pagination: Pagination = { page: 1, limit: 10 };

    (mockTripRepository.count as jest.Mock).mockResolvedValue(0);
    (mockTripRepository.findAll as jest.Mock).mockResolvedValue([]);

    const result: PaginationResult<Trip> =
      await tripFindAllActives.execute(pagination);

    expect(mockTripRepository.count).toHaveBeenCalledWith({
      status: TripStatus.ACCEPT,
    });
    expect(mockTripRepository.findAll).toHaveBeenCalledWith(
      { status: TripStatus.ACCEPT },
      pagination,
      0, // totalPages calculated based on 0 items
    );
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toEqual([]);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it('should correctly calculate totalPages based on count and limit', async () => {
    const pagination: Pagination = { page: 1, limit: 3 };
    const trips: Trip[] = [
      {
        id: '1',
        status: TripStatus.ACCEPT,
        origin: undefined,
        destination: undefined,
        passenger: '',
      },
      {
        id: '2',
        status: TripStatus.ACCEPT,
        origin: undefined,
        destination: undefined,
        passenger: '',
      },
      {
        id: '3',
        status: TripStatus.ACCEPT,
        origin: undefined,
        destination: undefined,
        passenger: '',
      },
    ];

    (mockTripRepository.count as jest.Mock).mockResolvedValue(5);
    (mockTripRepository.findAll as jest.Mock).mockResolvedValue(trips);

    const result: PaginationResult<Trip> =
      await tripFindAllActives.execute(pagination);

    expect(mockTripRepository.count).toHaveBeenCalledWith({
      status: TripStatus.ACCEPT,
    });
    expect(mockTripRepository.findAll).toHaveBeenCalledWith(
      { status: TripStatus.ACCEPT },
      pagination,
      2, // totalPages calculated based on 5 items with limit 3
    );
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toBe(trips);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(2);
    expect(result.totalItems).toBe(5);
  });
});
