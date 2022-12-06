import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly: string;
}

export class UpdateUserDto extends PartialType(CreateOrderDto) {}
