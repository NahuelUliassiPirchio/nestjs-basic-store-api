import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
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
