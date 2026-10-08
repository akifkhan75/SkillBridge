import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class SubmitOfferDto {
  /** Integer minor units in the worker's currency (paisa for PKR). */
  @IsInt() @Min(1) @Max(100_000_000)
  amount: number;

  /** How soon they can arrive. */
  @IsOptional() @IsInt() @Min(5) @Max(2880)
  etaMinutes?: number;

  @IsOptional() @IsString() @MaxLength(300)
  note?: string;
}
