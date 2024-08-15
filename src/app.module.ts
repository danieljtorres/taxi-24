import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DatabaseModule } from '@Infrastructure/database/database.module';
import { EnvModule } from '@Infrastructure/env/env.module';
import { LoggerModule } from '@Infrastructure/logger/logger.module';
import { DriversModule } from '@Presentation/drivers/drivers.module';

@Module({
  imports: [
    EnvModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    LoggerModule,
    DatabaseModule,
    DriversModule,
  ],
})
export class AppModule {}
