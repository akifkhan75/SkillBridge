import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
export { DecideDto } from '../../quotes/dto/quote.dto';

export class CreateChangeOrderDto {
  @IsString() @IsNotEmpty() @MaxLength(64)
  jobRequestId: string;

  @IsString() @IsNotEmpty() @MaxLength(500)
  reason: string;

  @IsString() @IsNotEmpty() @MaxLength(2000)
  addedScope: string;

  /** New total in integer minor units. */
  @IsInt() @Min(1) @Max(100_000_000)
  revisedPrice: number;

  @IsOptional() @IsString({ each: true })
  mediaKeys?: string[];

  @IsOptional() @IsString() @Length(3, 3)
  currency?: string;
}
