import { Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { TripsModule } from './trips.module';
import { TripFindAllActives } from '@Application/userCases/trips/findAllActives';
import { SwaggerQueryPagination } from '@Infrastructure/nestjs/decorators/swaggerPaginationParams.decorator';
import { /*ApiOkResponse,*/ ApiOperation, ApiParam } from '@nestjs/swagger';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { Pagination } from '@Domain/entities/common.entity';
import { GetPagination } from '@Infrastructure/nestjs/decorators/getPagination.decorator';
import { TripAccept } from '@Application/userCases/trips/accept';
import { TripComplete } from '@Application/userCases/trips/complete';
import { IsObjectIdPipe } from 'nestjs-object-id';

@Controller('trips')
export class TripsController {
  constructor(
    @Inject(TripsModule.FIND_ALL_ACTIVES_USECASE)
    private readonly findAllActivesUseCase: TripFindAllActives,
    @Inject(TripsModule.ACCEPT_USECASE)
    private readonly acceptUseCase: TripAccept,
    @Inject(TripsModule.COMPLETE_USECASE)
    private readonly completeUseCase: TripComplete,
  ) {}

  @Get('actives')
  @SwaggerQueryPagination()
  @ApiOperation({
    description: 'Get All Trip paginated',
  })
  // @ApiOkResponse({
  //   type: PaginationResultPresenter<TripPresenter>,
  // })
  async getAll(@GetPagination() pagination: PaginationDTO) {
    return await this.findAllActivesUseCase.execute(pagination as Pagination);
  }

  @Patch(':id/driver/:driverId/accept')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiParam({
    name: 'driverId',
    type: String,
  })
  @ApiOperation({
    description: 'A driver can accept a trip requested',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<TripPresenter>,
  // })
  async acceptTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @Param('driverId', IsObjectIdPipe) driverId: string,
  ) {
    return await this.acceptUseCase.execute(id, driverId);
  }

  @Patch(':id/driver/:driverId/complete')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiParam({
    name: 'driverId',
    type: String,
  })
  @ApiOperation({
    description: 'A driver can complete a trip accepted',
  })
  // @ApiOkResponse({
  //   type: ResultPresenter<TripPresenter>,
  // })
  async completeTrip(
    @Param('id', IsObjectIdPipe) id: string,
    @Param('driverId', IsObjectIdPipe) driverId: string,
  ) {
    return await this.completeUseCase.execute(id, driverId);
  }
}
