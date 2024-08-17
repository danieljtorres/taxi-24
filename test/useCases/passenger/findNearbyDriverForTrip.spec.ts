import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { PassengerFindNearbyDriverForTrip } from '@Application/userCases/passenger/findNearbyDriverForTrip';
import { TripStatus } from '@Domain/entities/trip.entity';
import { faker } from '@faker-js/faker';
import { MIN_NEARBY_DRIVERS } from '@Utils/constants';
import { getDistance } from '@Utils/geo';

describe('PassengerFindNearbyDriverForTrip', () => {
  let findNearbyDriverForTrip: PassengerFindNearbyDriverForTrip;
  let mockPassengerRepository: jest.Mocked<PassengerRepository>;
  let mockTripRepository: jest.Mocked<TripRepository>;
  let mockDriverRepository: jest.Mocked<DriverRepository>;
  let mockExceptions: jest.Mocked<ExceptionService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockPassengerRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PassengerRepository>;

    mockTripRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<TripRepository>;

    mockDriverRepository = {
      findAvailablesNearby: jest.fn(),
    } as unknown as jest.Mocked<DriverRepository>;

    mockExceptions = {
      BadRequestException: jest
        .fn()
        .mockImplementation(({ message }) => new Error(message)),
    } as unknown as jest.Mocked<ExceptionService>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findNearbyDriverForTrip = new PassengerFindNearbyDriverForTrip(
      mockPassengerRepository,
      mockTripRepository,
      mockDriverRepository,
      mockExceptions,
      mockLogger,
    );
  });

  it('should throw BadRequestException if passenger is not found', async () => {
    const passengerId = faker.database.mongodbObjectId();
    const tripId = faker.database.mongodbObjectId();

    mockPassengerRepository.findById.mockResolvedValue(null);

    await expect(
      findNearbyDriverForTrip.execute(passengerId, tripId),
    ).rejects.toThrow(new Error(`Passenger with id: ${passengerId} not found`));
  });

  it('should throw BadRequestException if trip is not found', async () => {
    const passengerId = 'passenger-id';
    const tripId = 'trip-id';

    mockPassengerRepository.findById.mockResolvedValue({
      id: passengerId,
    } as any);
    mockTripRepository.findById.mockResolvedValue(null);

    await expect(
      findNearbyDriverForTrip.execute(passengerId, tripId),
    ).rejects.toThrow(new Error(`Trip with id: ${tripId} not found`));
  });

  it('should throw BadRequestException if trip does not belong to passenger', async () => {
    const passengerId = 'passenger-id';
    const tripId = 'trip-id';

    mockPassengerRepository.findById.mockResolvedValue({
      id: passengerId,
    } as any);
    mockTripRepository.findById.mockResolvedValue({
      id: tripId,
      status: TripStatus.REQUESTED,
      passenger: 'otherPassengerId',
    } as any);

    await expect(
      findNearbyDriverForTrip.execute(passengerId, tripId),
    ).rejects.toThrow(
      new Error(
        `Trip with id: ${tripId} does not belong to passenger with id: ${passengerId}`,
      ),
    );
  });

  it('should return nearby drivers when all validations pass', async () => {
    const passengerId = 'passenger-id';
    const tripId = 'trip-id';

    const location = { latitude: 1, longitude: 1 };

    const drivers = [
      {
        id: faker.database.mongodbObjectId(),
        actualLocation: location,
      },
      {
        id: faker.database.mongodbObjectId(),
        actualLocation: location,
      },
    ];

    mockPassengerRepository.findById.mockResolvedValue({
      id: passengerId,
    } as any);
    mockTripRepository.findById.mockResolvedValue({
      id: tripId,
      status: TripStatus.REQUESTED,
      passenger: passengerId,
      origin: location,
    } as any);
    mockDriverRepository.findAvailablesNearby.mockResolvedValue(drivers as any);

    const result = await findNearbyDriverForTrip.execute(passengerId, tripId);

    expect(mockDriverRepository.findAvailablesNearby).toHaveBeenCalledWith(
      { latitude: 1, longitude: 1 },
      MIN_NEARBY_DRIVERS,
    );
    expect(result).toEqual({
      result: drivers.map((driver) => {
        return {
          distance: getDistance(location, driver.actualLocation),
          ...driver,
        };
      }),
    });
  });
});
