import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsEnum(UserRole)
  // readonly role: UserRole;

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

export class FilterUserDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @Min(0)
  readonly offset: number;
}
