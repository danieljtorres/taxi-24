export const calculatedPages = (count: number, limit: number): number =>
  Math.ceil(count / limit);

export const getMongoSkip = (
  page: number,
  limit: number,
  totalPages: number,
) => {
  let skip = page;

  if (page <= totalPages) if (page > 0) skip -= 1;

  return skip * limit;
};
