export interface IFormatExceptionMessage {
  message: string;
  errorCode?: number;
}

export abstract class ExceptionService {
  abstract BadRequestException(data: IFormatExceptionMessage): void;
  abstract InternalServerErrorException(data?: IFormatExceptionMessage): void;
}
