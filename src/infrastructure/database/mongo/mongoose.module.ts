import { Module } from '@nestjs/common';
import { MongooseModule as MongooseModuleLib } from '@nestjs/mongoose';
import { EnvService } from '@Infrastructure/env/env.service';
import { CONFIG_PROVIDER } from '@Infrastructure/env';
import { createMongooseOptions } from './config';

@Module({
  imports: [
    MongooseModuleLib.forRootAsync({
      useFactory: async (configService: EnvService) => {
        return createMongooseOptions(configService.get('mongo'));
      },
      inject: [CONFIG_PROVIDER],
    }),
    MongooseModuleLib.forFeature([]),
  ],
})
export class MongooseModule {}
