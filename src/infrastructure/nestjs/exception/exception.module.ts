import { Global, Module } from '@nestjs/common';
import { NestExceptionsService } from './exception.service';
import { ExceptionService } from '@Application/providers/exception.service';

@Global()
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
