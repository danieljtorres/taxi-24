import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { DriverFindAvailablesNearby } from '@Application/userCases/driver/findAvailablesNearby';
import { Driver } from '@Domain/entities/driver.entity';
import { faker } from '@faker-js/faker';
import { makeDriversSeeds } from 'test/seeds/driver';

describe('DriverFindAvailablesNearby', () => {
  let findAvailablesNearbyUseCase: DriverFindAvailablesNearby;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockDriverRepository = {
      findAvailablesNearby: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findAvailablesNearbyUseCase = new DriverFindAvailablesNearby(
      mockDriverRepository,
      mockLogger,
    );
  });

  it('should return an object with drivers found', async () => {
    const drivers = makeDriversSeeds(2);

    const location = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    mockDriverRepository.findAvailablesNearby.mockResolvedValue(drivers);

    const result = await findAvailablesNearbyUseCase.execute(location);

    expect(mockDriverRepository.findAvailablesNearby).toHaveBeenCalledWith(
      location,
    );
    expect(result.result).toBeInstanceOf(Array<Driver>);
  });
});
