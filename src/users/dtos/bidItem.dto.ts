import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBidItemDto {
  @IsNotEmpty()
  @IsPositive()
  readonly bidAmount: number;

  @IsNotEmpty()
  @IsPositive()
  readonly bidId: number;
}

export class UpdateBidItemDto extends CreateBidItemDto {}
