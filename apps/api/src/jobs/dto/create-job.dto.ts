import { IsNotEmpty, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'My kitchen faucet is leaking and needs repair' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 'PLUMBING' })
  @IsString()
  @IsNotEmpty()
  jobType: string;

  @ApiPropertyOptional({ example: 'New York, NY' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'ASAP' })
  @IsOptional()
  @IsString()
  requestedDate?: string;

  @ApiPropertyOptional({ example: 'High' })
  @IsOptional()
  @IsString()
  urgency?: string;

  @ApiPropertyOptional({ example: 'Major' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ example: '1-2 hours' })
  @IsOptional()
  @IsString()
  estimatedDuration?: string;

  @ApiPropertyOptional({ example: 'Moderate' })
  @IsOptional()
  @IsString()
  priceEstimate?: string;
}
