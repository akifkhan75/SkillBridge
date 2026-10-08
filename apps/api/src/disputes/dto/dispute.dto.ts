import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDisputeDto {
  @IsString() @IsNotEmpty() @MaxLength(64)
  jobRequestId: string;

  @IsString() @IsNotEmpty() @MaxLength(120)
  reason: string;

  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;
}

export class ResolveDisputeDto {
  @IsIn(['IN_REVIEW', 'RESOLVED', 'CLOSED'])
  status: 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';

  @IsOptional() @IsString() @MaxLength(2000)
  resolution?: string;
}
