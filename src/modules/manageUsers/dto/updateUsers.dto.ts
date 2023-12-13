import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUsersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @IsNumber()
  @IsOptional()
  role_id?: number;
}
