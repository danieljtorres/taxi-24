import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { FindAvailables } from '@Application/userCases/driver';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('Driver - FindAvailables', () => {
  let findAvailablesUseCase: FindAvailables;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findAvailables: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAvailablesUseCase = new FindAvailables(
      mockDriverRepository,
      mockLogger,
    );
  });

  it('should return an object with Drivers found', async () => {
    const drivers = makeDriversSeeds(2);

    mockDriverRepository.findAvailables.mockResolvedValue(drivers);

    const result = await findAvailablesUseCase.execute();

    expect(mockDriverRepository.findAvailables).toHaveBeenCalled();
    expect(result.result).toBeInstanceOf(Array<DriverPresenter>);
    expect(result.result[0]).toBeInstanceOf(DriverPresenter);
  });
});
