import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestWorkerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  workerId: string;
}
