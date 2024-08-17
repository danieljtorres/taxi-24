import { Module } from '@nestjs/common';
import { DriversModule } from './drivers/drivers.module';
import { DriversController } from './drivers/drivers.controller';
import { PassengersModule } from './passengers/passengers.module';
import { PassengersController } from './passengers/passengers.controller';

@Module({
  imports: [DriversModule.register(), PassengersModule.register()],
  controllers: [DriversController, PassengersController],
})
export class ControllersModule {}
