import { FindById } from '@Application/userCases/driver';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import { makeDriverSeed } from 'test/seeds/driver';

describe('FindById', () => {
  let findById: FindById;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findById = new FindById(mockDriverRepository, mockLogger);
  });

  it('should return an object with a Driver found', async () => {
    const driver = makeDriverSeed();
    mockDriverRepository.findById.mockResolvedValue(driver);

    const result = await findById.execute(driver.id);

    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driver.id);
    expect(result.result).toBeInstanceOf(DriverPresenter);
    expect(result.result).toEqual(new DriverPresenter(driver));
  });

  it('should return null when no Driver is found', async () => {
    mockDriverRepository.findById.mockResolvedValue(null);

    const result = await findById.execute('123');

    expect(mockDriverRepository.findById).toHaveBeenCalledWith('123');
    expect(result.result).toBeNull();
  });
});
