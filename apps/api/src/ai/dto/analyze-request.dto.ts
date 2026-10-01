import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeRequestDto {
  @ApiProperty({ example: 'My kitchen faucet is leaking constantly and needs to be fixed urgently.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
