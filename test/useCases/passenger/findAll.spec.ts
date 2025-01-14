import { LoggerService } from '@Application/providers/logger.service';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { PassengerFindAll } from '@Application/userCases/passenger/findAll';
import { SortEnum } from '@Domain/entities/common.entity';
import { Passenger } from '@Domain/entities/passenger.entity';
import { makePassengersSeeds } from 'test/seeds/passenger';

describe('PassengerFindAll', () => {
  let findAllUseCase: PassengerFindAll;
  let mockPassengerRepository: jest.Mocked<PassengerRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockPassengerRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PassengerRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAllUseCase = new PassengerFindAll(mockPassengerRepository, mockLogger);
  });

  it('should return an paginate object with passengers found', async () => {
    const passengers = makePassengersSeeds(2);
    const count = 10;

    const pagination = {
      page: 1,
      limit: 2,
      sort: SortEnum.ASC,
    };

    const totalPages = Math.ceil(count / pagination.limit);

    mockPassengerRepository.findAll.mockResolvedValue(passengers);
    mockPassengerRepository.count.mockResolvedValue(count);

    const result = await findAllUseCase.execute(pagination);

    expect(mockPassengerRepository.count).toHaveBeenCalled();
    expect(mockPassengerRepository.findAll).toHaveBeenCalledWith(
      {},
      pagination,
      totalPages,
    );
    expect(result.result).toBeInstanceOf(Array<Passenger>);
    expect(result.totalPages).toBe(totalPages);
    expect(result.totalItems).toBe(count);
  });
});
