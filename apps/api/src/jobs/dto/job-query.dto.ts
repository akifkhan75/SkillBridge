import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export const JOB_STATUSES = [
  'CREATED',
  'MATCHES_FOUND',
  'AWAITING_WORKER',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;

export class JobQueryDto {
  @IsOptional()
  @IsIn(JOB_STATUSES)
  status?: (typeof JOB_STATUSES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(64)
  serviceId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  cursor?: string;
}
