import { IsString, IsUrl } from 'class-validator';

export class AvatarDto {
  @IsUrl()
  url!: string;

  @IsString()
  filedId!: string;
}
