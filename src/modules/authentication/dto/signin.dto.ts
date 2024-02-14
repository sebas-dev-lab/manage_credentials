import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'example@email.com',
    required: true
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'PassW0rd!',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
