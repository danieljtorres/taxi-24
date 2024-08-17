import { DynamicModule, Module } from '@nestjs/common';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { PassengerFindAll } from '@Application/userCases/passenger/findAll';
import { PassengerFindById } from '@Application/userCases/passenger/findById';
import { TripRepository } from '@Application/repositories/trip.repository';
import { ExceptionService } from '@Application/providers/exception.service';
import { PassengerRequestTrip } from '@Application/userCases/passenger/requestTrip';
import { PassengerFindNearbyDriverForTrip } from '@Application/userCases/passenger/findNearbyDriverForTrip';
import { DriverRepository } from '@Application/repositories/driver.repository';

@Module({})
export class PassengersModule {
  static FIND_ALL_USECASE = 'passengerFindAllUseCase';
  static FIND_BY_ID_USECASE = 'passengerFinByIdUseCase';
  static REQUEST_TRIP_USECASE = 'passengerRequestTripUseCase';
  static FIND_NEARBY_DRIVERS_FOR_TRIP_USECASE =
    'passengerFindNearbyDriversForTripUseCase';

  static register(): DynamicModule {
    return {
      module: PassengersModule,
      providers: [
        {
          inject: [PassengerRepository, LoggerService],
          provide: PassengersModule.FIND_ALL_USECASE,
          useFactory: (
            passengerRepository: PassengerRepository,
            logger: LoggerService,
          ) => new PassengerFindAll(passengerRepository, logger),
        },
        {
          inject: [PassengerRepository, LoggerService],
          provide: PassengersModule.FIND_BY_ID_USECASE,
          useFactory: (
            passengerRepository: PassengerRepository,
            logger: LoggerService,
          ) => new PassengerFindById(passengerRepository, logger),
        },
        {
          inject: [
            PassengerRepository,
            TripRepository,
            ExceptionService,
            LoggerService,
          ],
          provide: PassengersModule.REQUEST_TRIP_USECASE,
          useFactory: (
            passengerRepository: PassengerRepository,
            tripRepository: TripRepository,
            exceptions: ExceptionService,
            logger: LoggerService,
          ) =>
            new PassengerRequestTrip(
              passengerRepository,
              tripRepository,
              exceptions,
              logger,
            ),
        },
        {
          inject: [
            PassengerRepository,
            TripRepository,
            DriverRepository,
            ExceptionService,
            LoggerService,
          ],
          provide: PassengersModule.FIND_NEARBY_DRIVERS_FOR_TRIP_USECASE,
          useFactory: (
            passengerRepository: PassengerRepository,
            tripRepository: TripRepository,
            driverRepository: DriverRepository,
            exceptions: ExceptionService,
            logger: LoggerService,
          ) =>
            new PassengerFindNearbyDriverForTrip(
              passengerRepository,
              tripRepository,
              driverRepository,
              exceptions,
              logger,
            ),
        },
      ],
      exports: [
        PassengersModule.FIND_ALL_USECASE,
        PassengersModule.FIND_BY_ID_USECASE,
        PassengersModule.REQUEST_TRIP_USECASE,
        PassengersModule.FIND_NEARBY_DRIVERS_FOR_TRIP_USECASE,
      ],
    };
  }
}
