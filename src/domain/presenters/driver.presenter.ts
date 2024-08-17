import { ApiProperty } from '@nestjs/swagger';
import { TripPresenter } from './trip.presenter';
import { BasePresenter } from './common';
import { Location } from '@Domain/entities/trip.entity';

export class DriverPresenter extends BasePresenter {
  @ApiProperty()
  name: string;
  @ApiProperty()
  actualLocation: Location;
  @ApiProperty({ type: TripPresenter })
  trips?: TripPresenter[];
}
