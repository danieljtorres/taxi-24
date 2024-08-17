import { Command, CommandRunner } from 'nest-commander';
import { Driver } from '../schemas/driver.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger } from '../schemas/passenger.schema';
import { faker } from '@faker-js/faker';
import { Trip } from '../schemas/trip.schema';
import { LoggerService } from '@Application/providers/logger.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tripLocations = [
  [-34.56547727533884, -58.45284494050236],
  [-34.588425931575536, -58.42525880864136],
  [-34.617434630315884, -58.433161814803555],
  [-34.57364937950123, -58.50598479980289],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const driversLocations = [
  [-34.5650651850288, -58.45521361468058], //Near 3km for index 0 of tripLocations
  [-34.56788988319584, -58.437422098268044], //Near 3km for index 0 of tripLocations
  [-34.55769322073777, -58.45026309369537], //Near 3km for index 0 of tripLocations
  [-34.55350187167799, -58.45332683875396], //Near 3km for index 0,1 of tripLocations
  [-34.56182021727798, -58.471051815252515], //Near 3km for index 0,1 of tripLocations
  [-34.58395107910648, -58.430427345141645], //Near 3km for index 1 of tripLocations
  [-34.58480451719889, -58.41609638241963], //Near 3km for index 1 of tripLocations
  [-34.593957885225166, -58.41125867165079], //Near 3km for index 1 of tripLocations
  [-34.58834296585874, -58.42519877115326], //Near 3km for index 1,2 of tripLocations
  [-34.62219051005502, -58.45459039203635], //Near 3km for index 2 of tripLocations
  [-34.62463379188071, -58.43248123044809], //Near 3km for index 2 of tripLocations
  [-34.632006831012724, -58.44239589028006], //Near 3km for index 2 of tripLocations
];

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
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async run(): Promise<void> {
    this.logger.info('Start command seed-data');

    try {
      //Faker data
      const seedDrivers = [...Array(10).keys()].map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (i): Driver => ({
          name: faker.person.fullName(),
          actualLocation: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
          },
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
          origin: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
          },
          destination: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
          },
          passenger: passengersCreated[0]._id,
          driver: driversCreated[0]._id,
        },
      ] as Trip[]);
    } catch (error) {
      this.logger.info(error);
    }

    this.logger.info('End command seed-data');
  }

  private async seedData(model, data) {
    const count = await model.countDocuments({});

    if (count > 0) {
      await model.deleteMany({});
      this.logger.info(`${count} ${model.name} deleted from collection`);
    }

    const created = await model.insertMany(data);

    this.logger.info(
      `${created.length} ${model.name} inserted to the collection`,
    );

    return created;
  }
}
