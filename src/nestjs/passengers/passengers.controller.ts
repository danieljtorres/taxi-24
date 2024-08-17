import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  // ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetPagination } from '@Infrastructure/nestjs/decorators/getPagination.decorator';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { SwaggerQueryPagination } from '@Infrastructure/nestjs/decorators/swaggerPaginationParams.decorator';
import { Pagination } from '@Domain/entities/common.entity';
import { PassengersModule } from './passengers.module';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { PassengerFindAll } from '@Application/userCases/passenger/findAll';
import { PassengerFindById } from '@Application/userCases/passenger/findById';
import { RequestTripDTO } from '@Domain/dtos/trip.dto';
import { PassengerRequestTrip } from '@Application/userCases/passenger/requestTrip';
import { PassengerFindNearbyDriverForTrip } from '@Application/userCases/passenger/findNearbyDriverForTrip';

@Controller('v1/passengers')
@ApiTags('Passengers')
export class PassengersController {
  constructor(
    @Inject(PassengersModule.FIND_ALL_USECASE)
    private readonly findAllUseCase: PassengerFindAll,
    @Inject(PassengersModule.FIND_BY_ID_USECASE)
    private readonly findByIdUseCase: PassengerFindById,
    @Inject(PassengersModule.REQUEST_TRIP_USECASE)
    private readonly requestTripUseCase: PassengerRequestTrip,
    @Inject(PassengersModule.FIND_NEARBY_DRIVERS_FOR_TRIP_USECASE)
    private readonly getNearbyDriverByTripUseCase: PassengerFindNearbyDriverForTrip,
  ) {}

  @Get('')
  @SwaggerQueryPagination()
  @ApiOperation({
    description: 'Get All Passengers paginated',
  })
  // @ApiOkResponse({
  //   type: PaginationResultPresenter<PassengerPresenter>,
  // })
  async getAll(@GetPagination() pagination: PaginationDTO) {
    return await this.findAllUseCase.execute(pagination as Pagination);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOperation({
    description: 'Get Passenger by id',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<PassengerPresenter>,
  // })
  async getById(@Param('id', IsObjectIdPipe) id: string) {
    return await this.findByIdUseCase.execute(id);
  }

  @Get(':id/trip/:tripId/nearby-drivers')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiParam({
    name: 'tripId',
    type: String,
  })
  @ApiOperation({
    description: 'Get the 3 nearby drivers for a requested trip',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<DriverPresenter>,
  // })
  async getNearbyDriversByTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @Param('tripId', IsObjectIdPipe) tripId: string,
  ) {
    return await this.getNearbyDriverByTripUseCase.execute(id, tripId);
  }

  @Post(':id/trip')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiBody({ type: RequestTripDTO })
  @ApiOperation({
    description: 'Post data to request a trip for passenger',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<TripPresenter>,
  // })
  async requestTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() data: RequestTripDTO,
  ) {
    return await this.requestTripUseCase.execute(id, data);
  }
}
