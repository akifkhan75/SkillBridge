import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString() @IsNotEmpty() @MaxLength(64)
  jobRequestId: string;

  @IsInt() @Min(1) @Max(5)
  rating: number;

  @IsOptional() @IsString() @MaxLength(1000)
  comment?: string;

  @IsOptional() @IsString({ each: true })
  tags?: string[];
}
