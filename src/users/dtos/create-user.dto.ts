import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../users.schema';
import { AvatarDto } from './avatar.dot';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  isEmailVerified!: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvatarDto)
  avatar?: AvatarDto;
}
