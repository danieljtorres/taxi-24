import { LoggerService } from '@Application/providers/logger.service';
import { Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

export const getJSONFormat = () => {
  return format.combine(
    // 'YYYY-MM-DD HH:mm:ss'
    format.timestamp({
      format: () => new Date(new Date().toUTCString()).toISOString(),
    }),
    format.metadata({
      fillExcept: ['level', 'message', 'context', 'event', 'timestamp'],
    }),
    format.printf((info) => {
      if ('error' in info.metadata) {
        info.metadata.error = info.metadata.error.stack;
      }

      const obj = {
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        component: info.context,
        event: info.event,
        metadata: info.metadata,
      };

      return JSON.stringify(obj);
    }),
  );
};

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: getJSONFormat(),
        }),
      ],
    });

    if (!this.logger) throw new Error('Logger is not created');
  }

  public log(message: any, ...optionalParams: [...any, string?]): void {
    const context = optionalParams.pop();
    this.logger.log(message, { context, ...optionalParams[0] });
  }

  public info(message: any, ...optionalParams: [...any, string?]): void {
    const context = optionalParams.pop();
    this.logger.info(message, { context, ...optionalParams[0] });
  }

  public error(message: any, ...optionalParams: [...any, string?]): void {
    let context = '';
    if (optionalParams.length > 1) {
      context = optionalParams.pop();
    }
    this.logger.error(message, { context, error: optionalParams[0] });
  }

  public warn = (message: string, data?: any) => {
    this.logger.warn(message, data);
  };

  public debug = (message: string, data?: any) => {
    this.logger.debug(message, data);
  };

  public verbose = (message: string, data?: any) => {
    this.logger.verbose(message, data);
  };
}
