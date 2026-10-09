import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMeDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) name?: string;
  @IsOptional() @IsIn(['en', 'ar', 'ur']) locale?: 'en' | 'ar' | 'ur';
  /** Upload id from POST /uploads (purpose AVATAR) after /complete. */
  @IsOptional() @IsString() @MaxLength(64) avatarUploadId?: string;
  @IsOptional() @IsBoolean() removeAvatar?: boolean;
}
