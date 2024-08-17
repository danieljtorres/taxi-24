import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { DriverFindAll } from '@Application/userCases/driver/findAll';
import { SortEnum } from '@Domain/entities/common.entity';
import { Driver } from '@Domain/entities/driver.entity';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('DriverFindAll', () => {
  let findAllUseCase: DriverFindAll;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAllUseCase = new DriverFindAll(mockDriverRepository, mockLogger);
  });

  it('should return an paginate object with drivers found', async () => {
    const drivers = makeDriversSeeds(2);
    const count = 10;

    const pagination = {
      page: 1,
      limit: 2,
      sort: SortEnum.ASC,
    };

    const totalPages = Math.ceil(count / pagination.limit);

    mockDriverRepository.findAll.mockResolvedValue(drivers);
    mockDriverRepository.count.mockResolvedValue(count);

    const result = await findAllUseCase.execute(pagination);

    expect(mockDriverRepository.count).toHaveBeenCalled();
    expect(mockDriverRepository.findAll).toHaveBeenCalledWith(
      {},
      pagination,
      totalPages,
    );
    expect(result.result).toBeInstanceOf(Array<Driver>);
    expect(result.totalPages).toBe(totalPages);
    expect(result.totalItems).toBe(count);
  });
});
