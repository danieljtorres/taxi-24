import { Passenger } from '@Domain/entities/passenger.entity';
import { faker } from '@faker-js/faker';

export const makePassengersSeeds = (qty: number = 1): Passenger[] =>
  [...Array(qty).keys()].map(() => makePassengerSeed());

export const makePassengerSeed = (): Passenger => ({
  id: faker.database.mongodbObjectId().toString(),
  name: faker.person.fullName(),
  createdAt: new Date(),
  updatedAt: new Date(),
});
