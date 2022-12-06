import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly stock: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsArray()
  readonly images: string[];
}

export class UpdateCategoryDto extends PartialType(CreateProductDto) {}
