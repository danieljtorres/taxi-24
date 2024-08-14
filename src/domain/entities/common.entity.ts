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
  items: TData[];
  page: number;
  totalPages: number;
  totalItems: number;
}
