import { Module } from '@nestjs/common';
import { MongooseModule as MongooseModuleLib } from '@nestjs/mongoose';
import { EnvService } from '@Infrastructure/env/env.service';
import { CONFIG_PROVIDER } from '@Infrastructure/env';
import { createMongooseOptions } from './config';

//Schemas
import { Trip, TripSchema } from './schemas/trip.schema';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Passenger, PassengerSchema } from './schemas/passenger.schema';

//Repositories
import { DriverRepository } from '@Application/repositories/driver.repository';

import { MongooseDriverRepository } from './repositories/driver.repository';
import { SeedsCommand } from './seeds';
import { MongooseDriverMapper } from './mappers/driver.mapper';

@Module({
  imports: [
    MongooseModuleLib.forRootAsync({
      useFactory: async (configService: EnvService) => {
        return createMongooseOptions(configService.get('mongo'));
      },
      inject: [CONFIG_PROVIDER],
    }),
    MongooseModuleLib.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Passenger.name, schema: PassengerSchema },
    ]),
  ],
  providers: [
    {
      provide: DriverRepository,
      useClass: MongooseDriverRepository,
    },
    SeedsCommand,
    MongooseDriverMapper,
  ],
  exports: [DriverRepository, SeedsCommand],
})
export class MongooseModule {}
