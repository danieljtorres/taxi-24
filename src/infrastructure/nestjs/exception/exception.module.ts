import { Module } from '@nestjs/common';
import { NestExceptionsService } from './exception.service';
import { ExceptionService } from '@Application/providers/exception.service';

@Module({
  providers: [
    {
      provide: ExceptionService,
      useClass: NestExceptionsService,
    },
  ],
  exports: [ExceptionService],
})
export class ExceptionsModule {}
