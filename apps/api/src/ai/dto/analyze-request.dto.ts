import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeRequestDto {
  @ApiProperty({ example: 'My kitchen faucet is leaking constantly and needs to be fixed urgently.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 'base64_encoded_image_string', required: false })
  @IsOptional()
  @IsString()
  imageBase64?: string;
}
