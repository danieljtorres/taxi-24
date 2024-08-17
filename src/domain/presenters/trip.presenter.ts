import { Location, Trip, TripStatus } from '@Domain/entities/trip.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BasePresenter } from './common';
import { Invoice } from '@Domain/entities/invoice.entity';
import { PassengerPresenter } from './passanger.presenter';
import { DriverPresenter } from './driver.presenter';

export class TripPresenter extends BasePresenter implements Trip {
  @ApiProperty()
  id: string;
  @ApiProperty()
  origin: Location;
  @ApiProperty()
  destination: Location;
  @ApiProperty({ enum: TripStatus })
  status: TripStatus;
  @ApiProperty({ type: PassengerPresenter })
  passenger: string | PassengerPresenter;
  @ApiProperty({ type: DriverPresenter })
  driver?: string | DriverPresenter;
  @ApiProperty()
  invoice?: Invoice;
}
