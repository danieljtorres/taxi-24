import { PaginationResult, Result } from '@Domain/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResultPresenter<T> implements PaginationResult<T> {
  @ApiProperty()
  result: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}

export class ResultPresenter<T> implements Result<T> {
  @ApiProperty()
  result: T;
}
