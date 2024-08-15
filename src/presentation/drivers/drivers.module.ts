import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import * as driverUseCases from '@Application/userCases/driver';

@Module({
  controllers: [DriversController],
  providers: [...Object.values(driverUseCases)],
})
export class DriversModule {}
