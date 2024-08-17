import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { TripComplete } from '@Application/userCases/trips/complete';
import { Trip, TripStatus } from '@Domain/entities/trip.entity';
import { tripStatusToLabel } from '@Utils/tripStatus';

describe('TripComplete', () => {
  let tripComplete: TripComplete;
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
      complete: jest.fn(),
    } as unknown as TripRepository;

    mockExceptions = {
      BadRequestException: jest.fn(),
    } as unknown as ExceptionService;

    mockLogger = {
      info: jest.fn(),
    } as unknown as LoggerService;

    tripComplete = new TripComplete(
      mockDriverRepository,
      mockTripRepository,
      mockExceptions,
      mockLogger,
    );
  });

  it('should complete a trip when the trip and driver exist, and trip is assigned to the driver and not completed', async () => {
    const id = 'trip-id';
    const driverId = 'driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.ACCEPT,
      driver: driverId,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };
    const driver = { id: driverId };
    const tripCompleted: Trip = {
      id,
      status: TripStatus.COMPLETED,
      driver: driverId,
      origin: undefined,
      destination: undefined,
      passenger: '',
    };

    (mockTripRepository.findById as jest.Mock).mockResolvedValue(trip);
    (mockDriverRepository.findById as jest.Mock).mockResolvedValue(driver);
    (mockTripRepository.complete as jest.Mock).mockResolvedValue(tripCompleted);

    const result = await tripComplete.execute(id, driverId);

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(mockTripRepository.complete).toHaveBeenCalledWith(id);
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result.result).toBe(tripCompleted);
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

    await expect(tripComplete.execute(id, driverId)).rejects.toThrow(
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
      status: TripStatus.ACCEPT,
      driver: driverId,
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

    await expect(tripComplete.execute(id, driverId)).rejects.toThrow(
      `Driver with id: ${driverId} not found`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Driver with id: ${driverId} not found`,
    });
  });

  it('should throw BadRequestException if the trip is already requested or completed', async () => {
    const id = 'trip-id';
    const driverId = 'driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.COMPLETED,
      driver: driverId,
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

    await expect(tripComplete.execute(id, driverId)).rejects.toThrow(
      `Trip with id: ${id} has already been ${tripStatusToLabel(trip.status)}`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Trip with id: ${id} has already been ${tripStatusToLabel(trip.status)}`,
    });
  });

  it('should throw BadRequestException if the trip is not assigned to the driver', async () => {
    const id = 'trip-id';
    const driverId = 'driver-id';
    const differentDriverId = 'different-driver-id';

    const trip: Trip = {
      id,
      status: TripStatus.ACCEPT,
      driver: differentDriverId,
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

    await expect(tripComplete.execute(id, driverId)).rejects.toThrow(
      `Trip with id: ${id} has not been accept to driver with id: ${driverId}`,
    );

    expect(mockTripRepository.findById).toHaveBeenCalledWith(id);
    expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(mockExceptions.BadRequestException).toHaveBeenCalledWith({
      message: `Trip with id: ${id} has not been accept to driver with id: ${driverId}`,
    });
  });
});
