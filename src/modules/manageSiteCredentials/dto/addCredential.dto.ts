import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class AddCredentialDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  site: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  auth_users?: number[];
}
