import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  readonly image: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class FilterBrandDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
