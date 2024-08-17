import { Module } from '@nestjs/common';
import { DriversModule } from './drivers/drivers.module';
import { DriversController } from './drivers/drivers.controller';
import { PassengersModule } from './passengers/passengers.module';
import { PassengersController } from './passengers/passengers.controller';
import { TripsModule } from './trips/trips.module';
import { TripsController } from './trips/trips.controller';

@Module({
  imports: [
    DriversModule.register(),
    PassengersModule.register(),
    TripsModule.register(),
  ],
  controllers: [DriversController, PassengersController, TripsController],
})
export class ControllersModule {}
