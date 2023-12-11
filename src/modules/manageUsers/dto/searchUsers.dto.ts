import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/abstracts/pagination.abstract";

export class SearchUsersWithPaginationDto extends PaginationDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsString()
    @IsOptional()
    email?: string;
}