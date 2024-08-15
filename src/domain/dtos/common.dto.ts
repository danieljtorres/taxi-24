import {
  Pagination,
  PaginationResult,
  SortEnum,
} from '@Domain/entities/common.entity';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';

export class PaginationDTO implements Pagination {
  @IsInt()
  @IsOptional()
  @Transform((value) => value && parseInt(value.toString()))
  page: number;

  @IsInt()
  @IsOptional()
  @Transform((value) => value && parseInt(value.toString()))
  limit: number;

  @IsEnum(SortEnum)
  @IsOptional()
  sort: SortEnum;
}

export class PaginationResultDTO<T> implements PaginationResult<T> {
  @IsArray()
  items: T[];

  @IsInt()
  page: number;

  @IsInt()
  totalPages: number;

  @IsInt()
  totalItems: number;
}
