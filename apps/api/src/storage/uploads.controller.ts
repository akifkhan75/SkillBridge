import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IsIn, IsInt, IsString, Max, Min } from 'class-validator';
import { StorageService } from './storage.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateUploadDto {
  @IsIn(['AVATAR', 'VERIFICATION', 'PORTFOLIO', 'JOB_PHOTO', 'JOB_AUDIO', 'CHAT_PHOTO']) purpose: 'AVATAR' | 'VERIFICATION' | 'PORTFOLIO' | 'JOB_PHOTO' | 'JOB_AUDIO' | 'CHAT_PHOTO';
  @IsString() mime: string;
  @IsInt() @Min(1) @Max(20 * 1024 * 1024) size: number;
}

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly storage: StorageService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Get a one-time slot to upload a photo directly to storage' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateUploadDto) {
    return this.storage.createUpload(userId, dto);
  }

  @Post(':id/complete')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOperation({ summary: 'Confirm the bytes arrived; the server verifies size and real file type' })
  complete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.storage.complete(userId, id);
  }

  @Get(':id/url')
  @ApiOperation({ summary: 'Short-lived link to a private upload (owner or admin)' })
  url(@CurrentUser() user: { id: string; type: string }, @Param('id') id: string) {
    return this.storage.signedUrlFor(user, id);
  }
}
