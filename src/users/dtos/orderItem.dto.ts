import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @IsNotEmpty()
  @IsPositive()
  readonly orderId: number;

  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
