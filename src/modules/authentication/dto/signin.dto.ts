import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
