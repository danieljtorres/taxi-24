import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { PassengerRequestTrip } from '@Application/userCases/passenger/requestTrip';
import { TripStatus, RequestTrip, Trip } from '@Domain/entities/trip.entity';
import { faker } from '@faker-js/faker';

describe('PassengerRequestTrip', () => {
  let passengerRequestTrip: PassengerRequestTrip;
  let mockPassengerRepository: PassengerRepository;
  let mockTripRepository: TripRepository;
  let mockExceptions: ExceptionService;
  let mockLogger: LoggerService;

  beforeEach(() => {
    mockPassengerRepository = {
      findById: jest.fn(),
    } as unknown as PassengerRepository;

    mockTripRepository = {
      findByPassenger: jest.fn(),
      request: jest.fn(),
    } as unknown as TripRepository;

    mockExceptions = {
      BadRequestException: jest.fn(),
    } as unknown as ExceptionService;

    mockLogger = {
      info: jest.fn(),
    } as unknown as LoggerService;

    passengerRequestTrip = new PassengerRequestTrip(
      mockPassengerRepository,
      mockTripRepository,
      mockExceptions,
      mockLogger,
    );
  });

  it('should throw BadRequestException if the passenger does not exist', async () => {
    const id = 'passenger-id';
    const data: RequestTrip = {} as unknown as RequestTrip;

    (mockPassengerRepository.findById as jest.Mock).mockReturnValue(null);
    (mockExceptions.BadRequestException as jest.Mock).mockImplementation(
      (error) => {
        throw new Error(error.message);
      },
    );

    await expect(passengerRequestTrip.execute(id, data)).rejects.toThrow(
      `Passenger with id: ${id} not found`,
    );

    expect(mockPassengerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Passenger with id: ${id} not found`,
    });
  });

  it('should throw BadRequestException if the passenger has active trips', async () => {
    const id = 'passenger-id';
    const data: RequestTrip = {} as unknown as RequestTrip;

    const passenger = { id };
    const activeTrips = [
      { id: 'active-trip-id', status: TripStatus.REQUESTED },
    ];

    (mockPassengerRepository.findById as jest.Mock).mockReturnValue(passenger);
    (mockTripRepository.findByPassenger as jest.Mock).mockResolvedValue(
      activeTrips,
    );
    (mockExceptions.BadRequestException as jest.Mock).mockImplementation(
      (error) => {
        throw new Error(error.message);
      },
    );

    await expect(passengerRequestTrip.execute(id, data)).rejects.toThrow(
      `Passenger with id: ${id} has requested or active trips`,
    );

    expect(mockPassengerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockTripRepository.findByPassenger).toHaveBeenCalledWith(id, [
      TripStatus.REQUESTED,
      TripStatus.ACCEPT,
    ]);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Passenger with id: ${id} has requested or active trips`,
    });
  });

  it('should create a trip when the passenger exists and has no active trips', async () => {
    const id = 'passenger-id';
    const data: RequestTrip = {
      origin: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      destination: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    };

    const passenger = { id };
    const trip: Trip = {
      id: 'requested-trip-id',
      status: TripStatus.REQUESTED,
      ...data,
      passenger: id,
    };

    (mockPassengerRepository.findById as jest.Mock).mockReturnValue(passenger);
    (mockTripRepository.findByPassenger as jest.Mock).mockResolvedValue([]);
    (mockTripRepository.request as jest.Mock).mockResolvedValue(trip);

    const result = await passengerRequestTrip.execute(id, data);

    expect(mockPassengerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockTripRepository.findByPassenger).toHaveBeenCalledWith(id, [
      TripStatus.REQUESTED,
      TripStatus.ACCEPT,
    ]);
    expect(mockTripRepository.request).toHaveBeenCalledWith(id, data);
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toBe(trip);
  });
});
