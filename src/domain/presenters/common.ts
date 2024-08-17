import {
  BaseEntity,
  PaginationResult,
  Result,
} from '@Domain/entities/common.entity';
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

export class BasePresenter implements BaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
