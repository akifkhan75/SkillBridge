import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class ReportIncidentDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['SOS', 'EMERGENCY', 'REPORT_PROBLEM'])
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['LIFE_THREATENING', 'PROPERTY_DAMAGE', 'MODERATE'])
  severity: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  targetId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  jobRequestId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class AddTrustedContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsBoolean()
  notifyOnSos?: boolean;
}
