import { SortEnum } from '@Domain/entities/common.entity';
import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function SwaggerQueryPagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', type: Number, required: false }),
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'sort', enum: SortEnum }),
  );
}
