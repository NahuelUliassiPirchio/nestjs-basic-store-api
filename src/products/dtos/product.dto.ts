import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsUrl()
  readonly image: string;

  @IsNotEmpty()
  @IsArray()
  readonly categoriesIds: number[];

  @IsNotEmpty()
  @IsPositive()
  readonly brandId: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;

  @IsOptional()
  @IsPositive()
  readonly minPrice: number;

  @IsOptional()
  @IsPositive()
  readonly maxPrice: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly categoriesIds: number[];

  @IsOptional()
  @IsString()
  readonly order: 'ASC' | 'DESC';
}
