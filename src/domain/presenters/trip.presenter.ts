import { Trip } from '@Domain/entities/trip.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TripPresenter {
  @ApiProperty()
  id: string;

  constructor(todo: Trip) {
    this.id = todo.id;
  }
}
