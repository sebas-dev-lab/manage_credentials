import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninValidationDTO {
  @ApiProperty({
    example: '12345678',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
