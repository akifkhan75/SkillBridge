import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(64)
  threadId: string;

  /** Ignored: the receiver is always the other participant of the thread. Kept for older clients. */
  @IsOptional() @IsString() @MaxLength(64)
  receiverId?: string;

  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(4000)
  text: string;
}
