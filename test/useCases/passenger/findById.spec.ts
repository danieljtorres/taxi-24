import { PassengerFindById } from '@Application/userCases/passenger/findById';
import { LoggerService } from '@Application/providers/logger.service';
import { PassengerRepository } from '@Application/repositories/passenger.repository';
import { makePassengerSeed } from 'test/seeds/passenger';

describe('PassengerFindById', () => {
  let findById: PassengerFindById;
  let mockPassengerRepository: jest.Mocked<PassengerRepository>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockPassengerRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PassengerRepository>;

    mockLogger = {
      info: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    findById = new PassengerFindById(mockPassengerRepository, mockLogger);
  });

  it('should return an object with a passenger found', async () => {
    const passenger = makePassengerSeed();
    mockPassengerRepository.findById.mockResolvedValue(passenger);

    const result = await findById.execute(passenger.id);

    expect(mockPassengerRepository.findById).toHaveBeenCalledWith(passenger.id);
    expect(result.result).toEqual(passenger);
  });

  it('should return null when no passenger is found', async () => {
    mockPassengerRepository.findById.mockResolvedValue(null);

    const result = await findById.execute('123');

    expect(mockPassengerRepository.findById).toHaveBeenCalledWith('123');
    expect(result.result).toBeNull();
  });
});
