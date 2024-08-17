import {
  Controller,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as driverUseCases from '@Application/userCases/driver';
import { GetPagination } from '@Infrastructure/nestjs/decorators/getPagination.decorator';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { SwaggerQueryPagination } from '@Infrastructure/nestjs/decorators/swaggerPaginationParams.decorator';
import { Pagination } from '@Domain/entities/common.entity';
import { DriversUseCasesModule } from './driversUseCases.module';
import { DriverPresenter } from '@Domain/presenters/driver.presenter';
import {
  PaginationResultPresenter,
  ResultPresenter,
} from '@Domain/presenters/common';

@Controller('v1/drivers')
@ApiTags('Drivers')
export class DriversController {
  constructor(
    @Inject(DriversUseCasesModule.FIND_ALL_USECASE)
    private readonly findAllUseCase: driverUseCases.FindAll,
    @Inject(DriversUseCasesModule.FIND_AVAILABLES_USECASE)
    private readonly findAvailablesUseCase: driverUseCases.FindAvailables,
    @Inject(DriversUseCasesModule.FIND_AVAILABLES_NEARBY_USECASE)
    private readonly findAvailablesNearbyUseCase: driverUseCases.FindAvailablesNearby,
    @Inject(DriversUseCasesModule.FIND_BY_ID_USECASE)
    private readonly findByIdUseCase: driverUseCases.FindById,
  ) {}

  @Get('')
  @SwaggerQueryPagination()
  @ApiOperation({
    description: 'Get All Drivers paginated',
  })
  @ApiOkResponse({
    type: PaginationResultPresenter<DriverPresenter>,
  })
  async getAll(@GetPagination() pagination: PaginationDTO) {
    return await this.findAllUseCase.execute(pagination as Pagination);
  }

  @Get('availables')
  @ApiOperation({
    description:
      'Get Drivers availables (Where a trip is not is status ASSIGNED or ONGOING)',
  })
  @ApiOkResponse({
    type: ResultPresenter<DriverPresenter>,
  })
  async getAvailables() {
    return await this.findAvailablesUseCase.execute();
  }

  @Get('availables/nearby')
  @ApiQuery({ name: 'location', isArray: true, type: Number, required: false })
  @ApiOperation({
    description: 'Get Drivers availables nearby (close to 3 km or less)',
  })
  @ApiOkResponse({
    type: ResultPresenter<Array<DriverPresenter>>,
  })
  async getAvailablesNearby(
    @Query('location', new ParseArrayPipe({ items: Number, separator: ',' }))
    location: number[],
  ) {
    return await this.findAvailablesNearbyUseCase.execute(location);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOperation({
    description: 'Get Driver by id',
  })
  @ApiOkResponse({
    type: ResultPresenter<DriverPresenter>,
  })
  async getById(@Param() params: any) {
    return await this.findByIdUseCase.execute(params.id);
  }
}
