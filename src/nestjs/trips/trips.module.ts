import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from '@Application/providers/logger.service';
import { TripRepository } from '@Application/repositories/trip.repository';
import { TripFindAllActives } from '@Application/userCases/trips/findAllActives';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { ExceptionService } from '@Application/providers/exception.service';
import { TripAccept } from '@Application/userCases/trips/accept';
import { TripComplete } from '@Application/userCases/trips/complete';

@Module({})
export class TripsModule {
  static FIND_ALL_ACTIVES_USECASE = 'tripFindAllActivesUseCase';
  static ACCEPT_USECASE = 'tripAcceptUseCase';
  static COMPLETE_USECASE = 'tripCompleteUseCase';

  static register(): DynamicModule {
    return {
      module: TripsModule,
      providers: [
        {
          inject: [TripRepository, LoggerService],
          provide: TripsModule.FIND_ALL_ACTIVES_USECASE,
          useFactory: (tripRepository: TripRepository, logger: LoggerService) =>
            new TripFindAllActives(tripRepository, logger),
        },
        {
          inject: [
            DriverRepository,
            TripRepository,
            ExceptionService,
            LoggerService,
          ],
          provide: TripsModule.ACCEPT_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            tripRepository: TripRepository,
            exceptions: ExceptionService,
            logger: LoggerService,
          ) =>
            new TripAccept(
              driverRepository,
              tripRepository,
              exceptions,
              logger,
            ),
        },
        {
          inject: [
            DriverRepository,
            TripRepository,
            ExceptionService,
            LoggerService,
          ],
          provide: TripsModule.COMPLETE_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            tripRepository: TripRepository,
            exceptions: ExceptionService,
            logger: LoggerService,
          ) =>
            new TripComplete(
              driverRepository,
              tripRepository,
              exceptions,
              logger,
            ),
        },
      ],
      exports: [
        TripsModule.FIND_ALL_ACTIVES_USECASE,
        TripsModule.ACCEPT_USECASE,
        TripsModule.COMPLETE_USECASE,
      ],
    };
  }
}
