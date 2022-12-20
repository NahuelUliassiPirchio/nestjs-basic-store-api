import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Brand name', example: 'Apple' })
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Brand image',
    example:
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  })
  readonly image: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class FilterBrandDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
