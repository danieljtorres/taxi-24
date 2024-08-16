import { Driver } from '@Domain/entities/driver.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TripPresenter } from './trip.presenter';

export class DriverPresenter {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  actualLocation: number[];
  @ApiProperty({ type: TripPresenter })
  trips?: TripPresenter[];
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(todo: Driver) {
    this.id = todo.id;
    this.name = todo.name;
    this.actualLocation = todo.actualLocation;
    if (todo.trips)
      this.trips = todo.trips.map((trip) => new TripPresenter(trip));
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
