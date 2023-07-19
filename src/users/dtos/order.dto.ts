import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './orderItem.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  readonly initialItems: CreateOrderItemDto[];

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
