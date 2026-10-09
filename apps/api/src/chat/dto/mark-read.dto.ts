import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(64)
  threadId: string;

  /** Ignored: the reader is always the authenticated user. Kept for older clients. */
  @IsOptional() @IsString() @MaxLength(64)
  userId?: string;
}
