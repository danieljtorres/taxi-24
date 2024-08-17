import { Driver } from '@Domain/entities/driver.entity';
import { faker } from '@faker-js/faker';

export const makeDriversSeeds = (qty: number = 1): Driver[] =>
  [...Array(qty).keys()].map(() => makeDriverSeed());

export const makeDriverSeed = (): Driver => ({
  id: faker.database.mongodbObjectId().toString(),
  name: faker.person.fullName(),
  actualLocation: {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});
