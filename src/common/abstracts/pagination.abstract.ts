import { IsNumber, IsOptional, IsPositive } from 'class-validator';
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
}
