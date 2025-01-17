import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { Result } from '@Domain/entities/common.entity';
import { Trip, TripStatus } from '@Domain/entities/trip.entity';
import { tripStatusToLabel } from '@Utils/tripStatus';

export class TripAccept {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly tripRepository: TripRepository,
    private readonly exceptions: ExceptionService,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string, driverId: string): Promise<Result<Trip>> {
    this.logger.info(
      `Starting ${TripAccept.name} use case with trip id: ${id} and driver id: ${driverId}`,
    );

    //Check is driver exists
    const trip = await this.tripRepository.findById(id);

    if (!trip)
      throw this.exceptions.BadRequestException({
        message: `Trip with id: ${id} not found`,
      });

    //Check if passanger has any requested or active trips
    const driver = await this.driverRepository.findById(driverId);

    if (!driver)
      throw this.exceptions.BadRequestException({
        message: `Driver with id: ${driverId} not found`,
      });

    if ([TripStatus.ACCEPT, TripStatus.COMPLETED].includes(trip.status))
      throw this.exceptions.BadRequestException({
        message: `Trip with id: ${id} already was ${tripStatusToLabel(trip.status)}`,
      });

    // Create the trip
    const tripAccepted = await this.tripRepository.assign(id, driverId);

    return {
      result: tripAccepted,
    };
  }
}
