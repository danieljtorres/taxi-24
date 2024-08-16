export enum SortEnum {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export interface Pagination {
  page?: number;
  limit?: number;
  sort?: SortEnum;
}

export interface PaginationResult<TData> {
  result: TData[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface Result<TData> {
  result: TData;
}
