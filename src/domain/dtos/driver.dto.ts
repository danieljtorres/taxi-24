import { Driver } from '@Domain/entities/driver.entity';
import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Trip } from '@Domain/entities/trip.entity';

export class DriverDTO implements Driver {
  @IsInt()
  @IsOptional()
  id: string;

  @IsString()
  name: string;

  @IsObject()
  actualLocation: number[];

  @IsArray()
  @IsOptional()
  trips?: Trip[];
}
