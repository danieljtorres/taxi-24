import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { TripStatus } from '@Domain/entities/trip.entity';
import { MIN_NEARBY_DRIVERS } from '@Utils/constants';
import { getDistance } from '@Utils/geo';

export class PassengerFindNearbyDriverForTrip {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly tripRepository: TripRepository,
    private readonly driverRepository: DriverRepository,
    private readonly exceptions: ExceptionService,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string, tripId: string) {
    this.logger.info(
      `Starting ${PassengerFindNearbyDriverForTrip.name} use case with passenger id: ${id} and tripId: ${tripId}`,
    );

    //Check if passanger exists
    const passenger = await this.passengerRepository.findById(id);

    if (!passenger)
      throw this.exceptions.BadRequestException({
        message: `Passenger with id: ${id} not found`,
      });

    //Check if trip exists and belong to the passanger
    const trip = await this.tripRepository.findById(tripId);

    if (!trip)
      throw this.exceptions.BadRequestException({
        message: `Trip with id: ${tripId} not found`,
      });

    if (trip.status !== TripStatus.REQUESTED)
      throw this.exceptions.BadRequestException({
        message: `Trip with id: ${tripId} has been accepted`,
      });

    if (String(trip.passenger) !== id)
      throw this.exceptions.BadRequestException({
        message: `Trip with id: ${tripId} does not belong to passenger with id: ${id}`,
      });

    const drivers = await this.driverRepository.findAvailablesNearby(
      trip.origin,
      MIN_NEARBY_DRIVERS,
    );

    return {
      result: drivers.map((driver) => {
        return {
          distance: getDistance(trip.origin, driver.actualLocation),
          ...driver,
        };
      }),
    };
  }
}
