import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { DriverFindAvailables } from '@Application/userCases/driver/findAvailables';
import { Driver } from '@Domain/entities/driver.entity';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('Driver - FindAvailables', () => {
  let findAvailablesUseCase: DriverFindAvailables;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findAvailables: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAvailablesUseCase = new DriverFindAvailables(
      mockDriverRepository,
      mockLogger,
    );
  });

  it('should return an object with Drivers found', async () => {
    const drivers = makeDriversSeeds(2);

    mockDriverRepository.findAvailables.mockResolvedValue(drivers);

    const result = await findAvailablesUseCase.execute();

    expect(mockDriverRepository.findAvailables).toHaveBeenCalled();
    expect(result.result).toBeInstanceOf(Array<Driver>);
  });
});
