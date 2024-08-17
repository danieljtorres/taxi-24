import {
  ExceptionService,
  IFormatExceptionMessage,
} from '@Application/providers/exception.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class NestExceptionsService implements ExceptionService {
  BadRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  InternalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  ForbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
}
