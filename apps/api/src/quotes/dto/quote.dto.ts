import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsString() @IsNotEmpty() @MaxLength(64)
  jobRequestId: string;

  /** Integer minor units (e.g. paisa/cents). Never a float. */
  @IsInt() @Min(1) @Max(100_000_000)
  totalAmount: number;

  @IsOptional() @IsString() @Length(3, 3)
  currency?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  details?: string;
}

export class DecideDto {
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}
