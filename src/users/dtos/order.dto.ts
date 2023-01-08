import { PartialType } from '@nestjs/swagger';
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

  @IsOptional()
  @IsPositive()
  readonly userSub: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class FilterOrderDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;

  @IsOptional()
  @IsString()
  readonly order: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  readonly isActive: 'true' | 'false';
}
