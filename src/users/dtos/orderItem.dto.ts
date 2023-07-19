import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @IsOptional()
  @IsPositive()
  readonly orderId: number;

  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
