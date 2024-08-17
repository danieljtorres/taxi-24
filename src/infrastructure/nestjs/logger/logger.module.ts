import { Global, Module } from '@nestjs/common';
import { WinstonLogger } from './winston';
import { LoggerService } from '@Application/providers/logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: WinstonLogger,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
