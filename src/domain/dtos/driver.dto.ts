import { Driver } from '@Domain/entities/driver.entity';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PointDTO } from './point.dto';

export class DriverDTO implements Driver {
  @IsInt()
  @IsOptional()
  id: string;

  @IsString()
  name: string;

  @IsObject()
  actualLocation: PointDTO;
}
