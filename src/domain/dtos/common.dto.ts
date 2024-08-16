import { Pagination, SortEnum } from '@Domain/entities/common.entity';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

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
