import {
  ArrayMaxSize, IsArray, IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(64)
  categoryId: string;

  @ApiPropertyOptional({ example: ['leaking_tap'] })
  @IsOptional() @IsArray() @ArrayMaxSize(6) @IsString({ each: true }) @MaxLength(64, { each: true })
  issueCodes?: string[];

  @ApiPropertyOptional({ example: 'Water drips under the kitchen sink all night' })
  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;

  /** Completed JOB_PHOTO uploads. */
  @IsOptional() @IsArray() @ArrayMaxSize(4) @IsString({ each: true })
  photoUploadIds?: string[];

  /** Completed JOB_AUDIO upload, plus the transcript the customer saw and confirmed. */
  @IsOptional() @IsString() @MaxLength(64)
  audioUploadId?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  audioTranscript?: string;

  /** One of the customer's saved addresses. */
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(64)
  addressId: string;

  @ApiProperty({ enum: ['NOW', 'TODAY', 'TOMORROW', 'SCHEDULED'] })
  @IsIn(['NOW', 'TODAY', 'TOMORROW', 'SCHEDULED'])
  when: 'NOW' | 'TODAY' | 'TOMORROW' | 'SCHEDULED';

  /** YYYY-MM-DD in the customer's local calendar (SCHEDULED only). */
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOptional() @IsIn(['MORNING', 'AFTERNOON', 'EVENING'])
  timeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING';

  @IsOptional() @IsBoolean()
  isEmergency?: boolean;

  /** The /ai/analyze result the customer saw, linked for later evaluation (doc 08). */
  @IsOptional() @IsString() @MaxLength(64)
  analysisId?: string;

  /** Generated once per request on the device; resending it returns the same job. */
  @ApiProperty() @IsString() @Length(8, 64)
  idempotencyKey: string;
}
