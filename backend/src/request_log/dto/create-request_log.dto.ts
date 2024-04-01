import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRequestLogDto {
  @IsString()
  @MinLength(1, { message: 'Name must have atleast 1 character.' })
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsEnum(['GET', 'POST', 'PUT', '', 'DELETE'])
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsEnum(['ERROR', 'REQUEST', 'RESPONSE'])
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsString()
  @MinLength(20, { message: 'Name must have atleast 20 characters.' })
  @IsNotEmpty()
  data: string;
}
