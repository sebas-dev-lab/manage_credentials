import { PaginationDto } from '../abstracts/pagination.abstract';
import {
  setPaginationOptions,
  setPaginationQueryOptions,
} from '../utils/setMetadataPagination.utils';

export default class BuildSearchQuery<T> {
  private selectQuery: string;
  private countQuery: string;
  private whereClause = '1 = 1';
  private configPage: { page: number; limit: number };

  constructor(
    private table_name: string,
    private readonly search: Partial<PaginationDto>,
    private readonly filters: Partial<T>,
    private readonly fieldsToSearchTerm: Array<string>,
  ) {}

  setFilters(): void {
    if (this.filters) {
      for (const key in this.filters) {
        this.whereClause += ` AND ${key} ILIKE '%${this.filters[key]}%'`;
      }
    }
  }

  setTerm(): void {
    let index = 0;
    if (this.search.term && this.fieldsToSearchTerm.length) {
      for (const field of this.fieldsToSearchTerm) {
        this.whereClause +=
          index === 0
            ? ` AND (${field} ILIKE '%${this.search.term}%'`
            : index === this.fieldsToSearchTerm.length - 1
            ? ` OR ${field} ILIKE '%${this.search.term}%')`
            : ` OR ${field} ILIKE '%${this.search.term}%'`;
        index++;
      }
    }
  }

  build(): void {
    this.configPage = setPaginationOptions(this.search);
    const configPageQuery = setPaginationQueryOptions(this.configPage);

    this.selectQuery = this.buildQueryByOperation('select', configPageQuery);
    this.countQuery = this.buildQueryByOperation('count');
  }

  getQuery(): {
    selectQuery: string;
    countQuery: string;
  } {
    return {
      selectQuery: this.selectQuery,
      countQuery: this.countQuery,
    };
  }

  getConfigPage(): { page: number; limit: number } {
    return this.configPage;
  }

  private buildQueryByOperation(
    operation: 'select' | 'count',
    pageOptions?: string,
  ): string {
    const order_by = this.search?.order_by
      ? this.search?.order_by.split(';').map((or) => or.split(':'))
      : [['id', 'asc']];

    return `
        SELECT ${operation === 'count' ? 'count(*)' : '*'}
        FROM ${this.table_name}
        ${operation !== 'count' ? `WHERE ${this.whereClause}` : ''}
        ${
          operation !== 'count'
            ? `ORDER BY ${order_by
                .map(([field, order]) => `${field} ${order}`)
                .join(', ')}`
            : ''
        }
        ${operation !== 'count' ? pageOptions : ''};
        `;
  }
}
