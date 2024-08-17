import { Location, RequestTrip } from '@Domain/entities/trip.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class LocationDTO implements Location {
  @ApiProperty()
  @IsNotEmpty()
  @IsLatitude()
  latitude: string | number;

  @ApiProperty()
  @IsNotEmpty()
  @IsLongitude()
  longitude: string | number;
}

export class RequestTripDTO implements RequestTrip {
  @ApiProperty({ type: LocationDTO })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => LocationDTO)
  origin: LocationDTO;

  @ApiProperty({ type: LocationDTO })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => LocationDTO)
  destination: LocationDTO;
}
