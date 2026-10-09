import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString() @IsNotEmpty() @MaxLength(60) type: string;
  @IsString() @IsNotEmpty() @MaxLength(300) streetAddress: string;
  @IsString() @IsNotEmpty() @MaxLength(100) city: string;
  @IsOptional() @IsString() @MaxLength(100) state?: string;
  @IsString() @IsNotEmpty() @MaxLength(100) country: string;
  @IsString() @IsNotEmpty() @MaxLength(20) postalCode: string;
  @IsOptional() @IsInt() @Min(1) @Max(1_000_000) squareFeet?: number;
  @IsOptional() @IsInt() @Min(1800) @Max(2100) builtYear?: number;
}

export class CreateAssetDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name: string;
  @IsString() @IsNotEmpty() @MaxLength(60) category: string;
  @IsOptional() @IsString() @MaxLength(100) make?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsDateString() installDate?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}

export class CreateWarrantyDto {
  @IsString() @IsNotEmpty() @MaxLength(120) provider: string;
  @IsOptional() @IsString() @MaxLength(100) policyNumber?: string;
  @IsDateString() expirationDate: string;
  @IsOptional() @IsString() @MaxLength(1000) coverageDetails?: string;
}
