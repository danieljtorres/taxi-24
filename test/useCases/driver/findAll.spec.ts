import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { FindAll } from '@Application/userCases/driver/findAll';
import { SortEnum } from '@Domain/entities/common.entity';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('Driver - FindAll', () => {
  let findAllUseCase: FindAll;
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

    findAllUseCase = new FindAll(mockDriverRepository, mockLogger);
  });

  it('should return an paginate object with Drivers found', async () => {
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
      pagination,
      totalPages,
    );
    expect(result.result).toBeInstanceOf(Array<DriverPresenter>);
    expect(result.result[0]).toBeInstanceOf(DriverPresenter);
    expect(result.totalPages).toBe(totalPages);
    expect(result.totalItems).toBe(count);
  });
});
