import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @IsNotEmpty() @MaxLength(80) name: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(60) iconName?: string;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class CreateServiceDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  /** Integer minor units. */
  @IsOptional() @IsInt() @Min(0) @Max(100_000_000) basePrice?: number;
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional() @IsBoolean() isActive?: boolean;
}
