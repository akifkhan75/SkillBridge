import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  threadId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
