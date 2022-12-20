import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsString()
  readonly initialDate: string;

  @IsNotEmpty()
  @IsString()
  readonly endDate: string;

  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;

  @IsOptional()
  @IsArray()
  readonly biddersIds: number[];
}

export class UpdateBidDto extends PartialType(CreateBidDto) {}

export class FilterBidDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
