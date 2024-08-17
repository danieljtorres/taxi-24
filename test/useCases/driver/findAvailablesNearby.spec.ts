import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { FindAvailablesNearby } from '@Application/userCases/driver';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import { faker } from '@faker-js/faker';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('Driver - FindAvailablesNearby', () => {
  let findAvailablesNearbyUseCase: FindAvailablesNearby;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findAvailablesNearby: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAvailablesNearbyUseCase = new FindAvailablesNearby(
      mockDriverRepository,
      mockLogger,
    );
  });

  it('should return an object with Drivers found', async () => {
    const drivers = makeDriversSeeds(2);

    const location = [faker.location.latitude(), faker.location.longitude()];

    mockDriverRepository.findAvailablesNearby.mockResolvedValue(drivers);

    const result = await findAvailablesNearbyUseCase.execute(location);

    expect(mockDriverRepository.findAvailablesNearby).toHaveBeenCalledWith(
      location,
    );
    expect(result.result).toBeInstanceOf(Array<DriverPresenter>);
    expect(result.result[0]).toBeInstanceOf(DriverPresenter);
  });
});
