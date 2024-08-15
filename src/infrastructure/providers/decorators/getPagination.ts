import { Pagination, SortEnum } from '@Domain/entities/common.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetPagination = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: Pagination = {
      page: 1,
      limit: 10,
      sort: SortEnum.DESC,
    };

    paginationParams.page = req.query.page
      ? parseInt(req.query.page.toString())
      : 1;
    paginationParams.limit = req.query.limit
      ? parseInt(req.query.limit.toString())
      : 10;

    if (req.query.sort) {
      paginationParams.sort =
        req.query.sort == SortEnum.DESC.toString()
          ? SortEnum.ASC
          : SortEnum.DESC;
    }

    return paginationParams;
  },
);
