import { Passenger } from '@Domain/entities/passenger.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BasePresenter } from './common';

export class PassengerPresenter extends BasePresenter {
  @ApiProperty()
  name: string;

  constructor(todo: Passenger) {
    super();
    this.id = todo.id;
    this.name = todo.name;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
