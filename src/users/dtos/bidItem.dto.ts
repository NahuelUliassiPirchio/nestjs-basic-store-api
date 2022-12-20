import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateBidItemDto {
  @IsNotEmpty()
  @IsPositive()
  readonly bidAmount: number;

  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @IsOptional()
  @IsPositive()
  readonly bidId: number;
}

export class UpdateBidItemDto extends PartialType(CreateBidItemDto) {}
