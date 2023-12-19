import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/abstracts/pagination.abstract';

export class SearchCredentialsWithPaginationDTO extends PaginationDto {
  @IsString()
  @IsOptional()
  term?: string;
}
