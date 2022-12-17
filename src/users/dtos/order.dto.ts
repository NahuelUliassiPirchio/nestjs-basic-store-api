import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @IsOptional()
  @IsArray()
  @IsNumber()
  readonly itemsIds: number[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class FilterOrderDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
