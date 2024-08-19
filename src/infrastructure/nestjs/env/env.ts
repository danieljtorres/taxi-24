import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

export enum NodeEnv {
  Development = 'development',
}

export enum LogLevel {
  Debug = 'debug',
  Verbose = 'verbose',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export const CONFIG_PROVIDER = 'CONFIG';

export class MongoEnv {
  @IsString()
  host?: string = process.env.MONGO_DB_HOST || 'localhost:27017';

  @IsString()
  database: string = process.env.MONGO_DB_DATABASE;

  @IsString()
  user?: string = process.env.MONGO_DB_USERNAME || '';

  @IsString()
  password?: string = process.env.MONGO_DB_PASSWORD || '';
}

export class Enviroment {
  static envDirectory: string;

  @IsEnum(NodeEnv)
  env = process.env.NODE_ENV as NodeEnv;

  @IsNumber()
  port = process.env.PORT ? Number(process.env.PORT) : 3000;

  @IsEnum(LogLevel)
  logLevel: string = process.env.LOG_LEVEL || 'info';

  @Type(() => MongoEnv)
  @ValidateNested()
  mongo: MongoEnv = new MongoEnv();
}
