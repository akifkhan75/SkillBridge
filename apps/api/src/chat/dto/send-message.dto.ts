import { IsNotEmpty, IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsOptional() @IsString() @MaxLength(64)
  threadId?: string;

  @IsOptional() @IsString() @MaxLength(64)
  receiverId?: string;

  @ApiProperty() @IsOptional() @IsString() @MaxLength(4000)
  text?: string;

  @ApiProperty() @IsOptional() @IsString() @MaxLength(128)
  clientId?: string;

  @ApiProperty() @IsOptional() @IsString() @MaxLength(256)
  imageKey?: string;

  @ApiProperty() @IsOptional() @IsBoolean()
  isSystem?: boolean;
}
