import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DatabaseModule } from '@Infrastructure/database/database.module';
import { EnvModule } from '@Infrastructure/env/env.module';
import { LoggerModule } from '@Infrastructure/logger/logger.module';
import { ControllersModule } from '@Presentation/controllers.module';
import { ExceptionsModule } from '@Infrastructure/exception/exception.module';

@Module({
  imports: [
    EnvModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ExceptionsModule,
    LoggerModule,
    DatabaseModule,
    ControllersModule,
  ],
})
export class AppModule {}
