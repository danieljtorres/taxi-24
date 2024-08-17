import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DatabaseModule } from '@Infrastructure/nestjs/databases/database.module';
import { EnvModule } from '@Infrastructure/nestjs/env/env.module';
import { LoggerModule } from '@Infrastructure/nestjs/logger/logger.module';
import { ControllersModule } from '@Presentation/nestjs/controllers.module';
import { ExceptionsModule } from '@Infrastructure/nestjs/exception/exception.module';

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
