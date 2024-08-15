import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as driverUseCases from '@Application/userCases/driver';
import { GetPagination } from '@Infrastructure/providers/decorators/getPagination';
import { PaginationDTO, PaginationResultDTO } from '@Domain/dtos/common.dto';
import { SwaggerQueryPagination } from '@Infrastructure/providers/decorators/swaggerPaginationParams';
import { DriverDTO } from '@Domain/dtos/driver.dto';

@Controller('v1/drivers')
@ApiTags('Drivers')
export class DriversController {
  constructor(private findAllUseCase: driverUseCases.FindAll) {}

  @Get('')
  @SwaggerQueryPagination()
  @ApiOkResponse({
    description: 'Drivers paginated',
    type: PaginationResultDTO<DriverDTO>,
  })
  async getAll(@GetPagination() pagination: PaginationDTO) {
    return await this.findAllUseCase.execute(pagination);
  }
}
