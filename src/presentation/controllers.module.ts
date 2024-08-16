import { Module } from '@nestjs/common';
import { DriversUseCasesModule } from './drivers/driversUseCases.module';
import { DriversController } from './drivers/drivers.controller';

@Module({
  imports: [DriversUseCasesModule.register()],
  controllers: [DriversController],
})
export class ControllersModule {}
