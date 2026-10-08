import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const CANCEL_REASONS = ['NO_LONGER_NEEDED', 'FOUND_SOMEONE_ELSE', 'TOO_SLOW', 'WRONG_DETAILS', 'OTHER'] as const;

export class CancelJobDto {
  @IsOptional() @IsIn(CANCEL_REASONS)
  reason?: (typeof CANCEL_REASONS)[number];

  @IsOptional() @IsString() @MaxLength(300)
  note?: string;
}
