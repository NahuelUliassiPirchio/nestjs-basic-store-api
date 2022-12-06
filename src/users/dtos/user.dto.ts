import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsUrl()
  readonly avatar: string;

  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
