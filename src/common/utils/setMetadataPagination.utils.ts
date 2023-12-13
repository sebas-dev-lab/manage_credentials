export const setMetadataPagination = (
  total: number,
  limit: number,
  page: number,
  data: any,
) => ({
  items: data,
  meta: {
    totalItems: total,
    itemsCount: data.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  },
});

export const setPaginationOptions = (
  options: any,
): { page: number; limit: number } => {
  const { page = 1, limit = 50 } = options;
  return {
    page,
    limit,
  };
};

export const setPaginationQueryOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): string => `limit ${limit} offset ${(page - 1) * limit}`;
