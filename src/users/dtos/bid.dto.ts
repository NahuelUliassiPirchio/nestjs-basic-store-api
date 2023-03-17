import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateBidDto {
  // iso8601 format example: 2021-01-01T00:00:00.000Z
  @IsNotEmpty()
  @IsDateString({ strict: true })
  readonly initialDate: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
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

  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;
}
