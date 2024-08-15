import { Command, CommandRunner } from 'nest-commander';
import { Driver } from '../schemas/driver.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger } from '../schemas/passenger.schema';
import { faker } from '@faker-js/faker';

@Command({
  name: 'seed-data',
  arguments: '',
  options: {},
})
export class SeedsCommand extends CommandRunner {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Passenger.name) private passengerModel: Model<Passenger>,
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
          actualLocation: {
            coordinates: [
              faker.location.latitude(),
              faker.location.longitude(),
            ],
          },
        }),
      );
      await this.seedData(this.driverModel, seedDrivers);

      //Faker data
      const seedPassengers = [...Array(10).keys()].map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (i): Passenger => ({
          name: faker.person.fullName(),
        }),
      );
      await this.seedData(this.passengerModel, seedPassengers);
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
  }
}
