import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  // ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetPagination } from '@Infrastructure/nestjs/decorators/getPagination.decorator';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { SwaggerQueryPagination } from '@Infrastructure/nestjs/decorators/swaggerPaginationParams.decorator';
import { Pagination } from '@Domain/entities/common.entity';
import { DriversModule } from './drivers.module';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { DriverFindAll } from '@Application/userCases/driver/findAll';
import { DriverFindAvailables } from '@Application/userCases/driver/findAvailables';
import { DriverFindAvailablesNearby } from '@Application/userCases/driver/findAvailablesNearby';
import { DriverFindById } from '@Application/userCases/driver/findById';
import { LocationDTO } from '@Domain/dtos/trip.dto';

@Controller('v1/drivers')
@ApiTags('Drivers')
export class DriversController {
  constructor(
    @Inject(DriversModule.FIND_ALL_USECASE)
    private readonly findAllUseCase: DriverFindAll,
    @Inject(DriversModule.FIND_AVAILABLES_USECASE)
    private readonly findAvailablesUseCase: DriverFindAvailables,
    @Inject(DriversModule.FIND_AVAILABLES_NEARBY_USECASE)
    private readonly findAvailablesNearbyUseCase: DriverFindAvailablesNearby,
    @Inject(DriversModule.FIND_BY_ID_USECASE)
    private readonly findByIdUseCase: DriverFindById,
  ) {}

  @Get('')
  @SwaggerQueryPagination()
  @ApiOperation({
    description: 'Get All Drivers paginated',
  })
  // @ApiOkResponse({
  //   type: PaginationResultPresenter<DriverPresenter>,
  // })
  async getAll(@GetPagination() pagination: PaginationDTO) {
    return await this.findAllUseCase.execute(pagination as Pagination);
  }

  @Get('availables')
  @ApiOperation({
    description:
      'Get Drivers availables (Where a trip is not is status ACCEPT or ONGOING)',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<DriverPresenter>,
  // })
  async getAvailables() {
    return await this.findAvailablesUseCase.execute();
  }

  @Get('availables/nearby')
  @ApiQuery({ name: 'latitude', type: Number, required: true })
  @ApiQuery({ name: 'longitude', type: Number, required: true })
  @ApiOperation({
    description: 'Get Drivers availables nearby (close to 3 km or less)',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<Array<DriverPresenter>>,
  // })
  async getAvailablesNearby(@Query() location: LocationDTO) {
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
  // @ApiOkResponse({
  //   type: ResultPresenter<DriverPresenter>,
  // })
  async getById(@Param('id', IsObjectIdPipe) id: string) {
    return await this.findByIdUseCase.execute(id);
  }
}
