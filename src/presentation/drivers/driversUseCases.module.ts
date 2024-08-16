import { DynamicModule, Module } from '@nestjs/common';
import * as driverUseCases from '@Application/userCases/driver';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger';
import { ExceptionService } from '@Application/providers/exception';

@Module({
  providers: [...Object.values(driverUseCases)],
})
export class DriversUseCasesModule {
  static FIND_ALL_USECASE = 'findAllUseCase';
  static FIND_BY_ID_USECASE = 'finByIdUseCase';
  static FIND_AVAILABLES_USECASE = 'findAvailablesUseCase';
  static FIND_AVAILABLES_NEARBY_USECASE = 'findAvailablesNearbyUseCase';

  static register(): DynamicModule {
    return {
      module: DriversUseCasesModule,
      providers: [
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversUseCasesModule.FIND_ALL_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new driverUseCases.FindAll(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversUseCasesModule.FIND_AVAILABLES_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new driverUseCases.FindAvailables(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversUseCasesModule.FIND_AVAILABLES_NEARBY_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) =>
            new driverUseCases.FindAvailablesNearby(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversUseCasesModule.FIND_BY_ID_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            exceptions: ExceptionService,
            logger: LoggerService,
          ) =>
            new driverUseCases.FindById(driverRepository, exceptions, logger),
        },
      ],
      exports: [
        DriversUseCasesModule.FIND_ALL_USECASE,
        DriversUseCasesModule.FIND_AVAILABLES_USECASE,
        DriversUseCasesModule.FIND_AVAILABLES_NEARBY_USECASE,
        DriversUseCasesModule.FIND_BY_ID_USECASE,
      ],
    };
  }
}
