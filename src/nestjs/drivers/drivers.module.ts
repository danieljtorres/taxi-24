import { DynamicModule, Module } from '@nestjs/common';
import { DriverRepository } from '@Application/repositories/driver.repository';
import { LoggerService } from '@Application/providers/logger.service';
import { DriverFindAll } from '@Application/userCases/driver/findAll';
import { DriverFindAvailables } from '@Application/userCases/driver/findAvailables';
import { DriverFindAvailablesNearby } from '@Application/userCases/driver/findAvailablesNearby';
import { DriverFindById } from '@Application/userCases/driver/findById';

@Module({})
export class DriversModule {
  static FIND_ALL_USECASE = 'driverFindAllUseCase';
  static FIND_BY_ID_USECASE = 'driverFindByIdUseCase';
  static FIND_AVAILABLES_USECASE = 'driverFindAvailablesUseCase';
  static FIND_AVAILABLES_NEARBY_USECASE = 'driverFindAvailablesNearbyUseCase';

  static register(): DynamicModule {
    return {
      module: DriversModule,
      providers: [
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversModule.FIND_ALL_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new DriverFindAll(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversModule.FIND_AVAILABLES_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new DriverFindAvailables(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversModule.FIND_AVAILABLES_NEARBY_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new DriverFindAvailablesNearby(driverRepository, logger),
        },
        {
          inject: [DriverRepository, LoggerService],
          provide: DriversModule.FIND_BY_ID_USECASE,
          useFactory: (
            driverRepository: DriverRepository,
            logger: LoggerService,
          ) => new DriverFindById(driverRepository, logger),
        },
      ],
      exports: [
        DriversModule.FIND_ALL_USECASE,
        DriversModule.FIND_AVAILABLES_USECASE,
        DriversModule.FIND_AVAILABLES_NEARBY_USECASE,
        DriversModule.FIND_BY_ID_USECASE,
      ],
    };
  }
}
