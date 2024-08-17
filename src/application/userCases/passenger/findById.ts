import { LoggerService } from '@Application/providers/logger.service';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { Passenger } from '@Domain/entities/passenger.entity';
import { ResultPresenter } from '@Domain/presenters/common';

export class PassengerFindById {
  constructor(
    private passengerRepository: PassengerRepository,
    private logger: LoggerService,
  ) {}

  async execute(id: string): Promise<ResultPresenter<Passenger | null>> {
    this.logger.info(
      `Starting ${PassengerFindById.name} use case with passenger id: ${id}`,
    );

    const passenger = await this.passengerRepository.findById(id);

    return {
      result: passenger ?? null,
    };
  }
}
