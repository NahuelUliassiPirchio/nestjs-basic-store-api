import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class FilterCategoryDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
