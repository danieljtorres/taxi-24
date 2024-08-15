import { IBaseRepository } from './base.repository';
import { DriverDTO } from '@Domain/dtos/driver.dto';

export abstract class DriverRepository extends IBaseRepository<DriverDTO> {}
