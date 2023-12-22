import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateUsersCredentialsDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  delete_users?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  add_users?: number[];
}
