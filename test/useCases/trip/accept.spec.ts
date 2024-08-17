import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { TripAccept } from '@Application/userCases/trips/accept';
import { Trip, TripStatus } from '@Domain/entities/trip.entity';
import { tripStatusToLabel } from '@Utils/tripStatus';

describe('TripAccept', () => {
  let tripAccept: TripAccept;
  let mockDriverRepository: DriverRepository;
  let mockTripRepository: TripRepository;
  let mockExceptions: ExceptionService;
  let mockLogger: LoggerService;

  beforeEach(() => {
    mockDriverRepository = {
      findById: jest.fn(),
    } as unknown as DriverRepository;

    mockTripRepository = {
      findById: jest.fn(),
      assign: jest.fn(),
    } as unknown as TripRepository;

    mockExceptions = {
      BadRequestException: jest.fn(),
    } as unknown as ExceptionService;

    mockLogger = {
      info: jest.fn(),
    } as unknown as LoggerService;

    tripAccept = new TripAccept(
      mockDriverRepository,
      mockTripRepository,
      mockExceptions,
      mockLogger,
    );
  });

  it('should throw BadRequestException if the trip does not exist', async () => {
    const id = 'non-existent-trip-id';
    const driverId = 'driver-id';

    (mockTripRepository.findById as jest.Mock).mockResolvedValue(null);
    (mockExceptions.BadRequestException as jest.Mock).mockImplementation(
      (error) => {
        throw new Error(error.message);
      },
    );

    await expect(tripAccept.execute(id, driverId)).rejects.toThrow(
      `Trip with id: ${id} not found`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Trip with id: ${id} not found`,
    });
  });

  it('should throw BadRequestException if the driver does not exist', async () => {
    const id = 'trip-id';
    const driverId = 'non-existent-driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.REQUESTED,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };

    (mockTripRepository.findById as jest.Mock).mockResolvedValue(trip);
    (mockDriverRepository.findById as jest.Mock).mockResolvedValue(null);
    (mockExceptions.BadRequestException as jest.Mock).mockImplementation(
      (error) => {
        throw new Error(error.message);
      },
    );

    await expect(tripAccept.execute(id, driverId)).rejects.toThrow(
      `Driver with id: ${driverId} not found`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Driver with id: ${driverId} not found`,
    });
  });

  it('should throw BadRequestException if the trip is already accepted or completed', async () => {
    const id = 'trip-id';
    const driverId = 'driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.ACCEPT,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };

    (mockTripRepository.findById as jest.Mock).mockResolvedValue(trip);
    (mockDriverRepository.findById as jest.Mock).mockResolvedValue({
      id: driverId,
    });
    (mockExceptions.BadRequestException as jest.Mock).mockImplementation(
      (error) => {
        throw new Error(error.message);
      },
    );

    await expect(tripAccept.execute(id, driverId)).rejects.toThrow(
      `Trip with id: ${id} already was ${tripStatusToLabel(trip.status)}`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Trip with id: ${id} already was ${tripStatusToLabel(trip.status)}`,
    });
  });

  it('should assign a trip when the trip and driver exist and trip is not already accepted or completed', async () => {
    const id = 'trip-id';
    const driverId = 'driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.REQUESTED,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };
    const driver = { id: driverId };
    const tripAccepted: Trip = {
      id,
      status: TripStatus.ACCEPT,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };

    (mockTripRepository.findById as jest.Mock).mockResolvedValue(trip);
    (mockDriverRepository.findById as jest.Mock).mockResolvedValue(driver);
    (mockTripRepository.assign as jest.Mock).mockResolvedValue(tripAccepted);

    const result = await tripAccept.execute(id, driverId);

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(mockTripRepository.assign).toHaveBeenCalledWith(id, driverId);
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toBe(tripAccepted);
  });
});
