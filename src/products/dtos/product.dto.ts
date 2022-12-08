import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
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
  @IsUrl()
  readonly images: string[];

  @IsNotEmpty()
  @IsArray()
  readonly categoriesIds: number[];

  @IsNotEmpty()
  @IsPositive()
  readonly brandId: number;
}

export class UpdateCategoryDto extends PartialType(CreateProductDto) {}
