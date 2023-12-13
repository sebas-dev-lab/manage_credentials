export type paginationType = {
  page?: number;
  limit?: number;
};

/**
 * order_by=filed1:asc;field2:desc;field3:asc
 */
export type orderType = {
  order_by?: string;
};

export type searchByTerm = {
  term?: string;
};

export type searchByFilter<T> = T;

export type genericSearchType<T> = paginationType &
  orderType &
  searchByTerm &
  searchByFilter<T>;
