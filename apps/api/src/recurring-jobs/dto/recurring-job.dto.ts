import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRecurringJobDto {
  @IsString() @IsNotEmpty() @MaxLength(64) serviceId: string;
  @IsIn(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']) frequency: string;
  @IsDateString() nextExecutionDate: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}
