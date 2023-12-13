import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export abstract class PaginationDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  /**
   * order_by=filed1:asc;field2:desc;field3:asc
   */
  @IsString()
  @IsOptional()
  order_by?: string;

  @IsString()
  @IsOptional()
  term?: string;
}
