import { ExceptionService } from '@Application/providers/exception.service';
import { LoggerService } from '@Application/providers/logger.service';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { TripRepository } from '@Application/repositories/trip.repository';
import { Result } from '@Domain/entities/common.entity';
import { RequestTrip, Trip, TripStatus } from '@Domain/entities/trip.entity';

export class PassengerRequestTrip {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly tripRepository: TripRepository,
    private readonly exceptions: ExceptionService,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string, data: RequestTrip): Promise<Result<Trip>> {
    this.logger.info(
      `Starting ${PassengerRequestTrip.name} use case with passenger id: ${id} and trip body: ${JSON.stringify(data)}`,
    );

    //Check is passenger exists
    const passenger = this.passengerRepository.findById(id);

    if (!passenger)
      throw this.exceptions.BadRequestException({
        message: `Passenger with id: ${id} not found`,
      });

    //Check if passanger has any requested or active trips
    const activeTrips = await this.tripRepository.findByPassenger(id, [
      TripStatus.REQUESTED,
      TripStatus.ASSIGNED,
    ]);

    if (activeTrips.length)
      throw this.exceptions.BadRequestException({
        message: `Passenger with id: ${id} has requested or active trips`,
      });

    // Create the trip
    const trip = await this.tripRepository.request(id, data);

    return {
      result: trip,
    };
  }
}
