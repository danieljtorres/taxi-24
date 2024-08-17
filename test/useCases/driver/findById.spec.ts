import { DriverFindById } from '@Application/userCases/driver/findById';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { makeDriverSeed } from 'test/seeds/driver';

describe('DriverFindById', () => {
  let findById: DriverFindById;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findById = new DriverFindById(mockDriverRepository, mockLogger);
  });

  it('should return null when no driver is found', async () => {
    mockDriverRepository.findById.mockResolvedValue(null);

    const result = await findById.execute('123');

    expect(mockDriverRepository.findById).toHaveBeenCalledWith('123');
    expect(result.result).toBeNull();
  });

  it('should return an object with a driver found', async () => {
    const driver = makeDriverSeed();
    mockDriverRepository.findById.mockResolvedValue(driver);

    const result = await findById.execute(driver.id);

    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driver.id);
    expect(result.result).toEqual(driver);
  });
});
