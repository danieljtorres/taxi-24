import { Command, CommandRunner } from 'nest-commander';
import { Driver } from '../schemas/driver.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger } from '../schemas/passenger.schema';
import { faker } from '@faker-js/faker';
import { Trip } from '../schemas/trip.schema';

@Command({
  name: 'seed-data',
  arguments: '',
  options: {},
})
export class SeedsCommand extends CommandRunner {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Passenger.name) private passengerModel: Model<Passenger>,
    @InjectModel(Trip.name) private tripModel: Model<Trip>,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('Start command seed-data');

    try {
      //Faker data
      const seedDrivers = [...Array(10).keys()].map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (i): Driver => ({
          name: faker.person.fullName(),
          actualLocation: [
            faker.location.latitude(),
            faker.location.longitude(),
          ],
        }),
      );
      const driversCreated = await this.seedData(this.driverModel, seedDrivers);

      //Faker data
      const seedPassengers = [...Array(10).keys()].map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (i): Passenger => ({
          name: faker.person.fullName(),
        }),
      );
      const passengersCreated = await this.seedData(
        this.passengerModel,
        seedPassengers,
      );

      await this.seedData(this.tripModel, [
        {
          origin: [faker.location.latitude(), faker.location.longitude()],
          destination: [faker.location.latitude(), faker.location.longitude()],
          passenger: passengersCreated[0]._id,
          driver: driversCreated[0]._id,
        },
      ] as Trip[]);
    } catch (error) {
      console.log(error);
    }

    console.log('End command seed-data');
  }

  private async seedData(model, data) {
    const count = await model.countDocuments({});

    if (count > 0) {
      await model.deleteMany({});
      console.log(`${count} ${model.name} deleted from collection`);
    }

    const created = await model.insertMany(data);

    console.log(`${created.length} ${model.name} inserted to the collection`);

    return created;
  }
}
