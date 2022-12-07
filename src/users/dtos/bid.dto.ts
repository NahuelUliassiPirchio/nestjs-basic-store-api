import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsDate()
  readonly initialDate: Date;

  @IsNotEmpty()
  @IsDate()
  readonly endDate: Date;

  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;

  @IsOptional()
  @IsArray()
  readonly biddersIds: number[];
}

export class UpdateBidDto extends PartialType(CreateBidDto) {}
