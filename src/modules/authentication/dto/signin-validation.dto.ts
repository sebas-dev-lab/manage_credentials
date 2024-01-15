import { IsNotEmpty, IsString } from 'class-validator';

export class SigninValidationDTO {
  @IsString()
  @IsNotEmpty()
  code: string;
}
