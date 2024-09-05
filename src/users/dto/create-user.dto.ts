import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Valentyn',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Bond',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@co.com',
  })
  @IsString()
  email: string;
}
