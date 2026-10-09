import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDateString, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { NotificationService } from './notifications.service';
import { SessionService } from '../auth/session.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class ListQuery {
  @IsOptional() @IsString() @MaxLength(64) cursor?: string;
  @IsOptional() @IsInt() @Min(1) @Max(50) limit?: number;
  /** Catch up after being offline: only items newer than this. */
  @IsOptional() @IsDateString() since?: string;
}
class ReadDto {
  /** Omit to mark everything read. */
  @IsOptional() @IsArray() @ArrayMaxSize(100) @IsString({ each: true }) ids?: string[];
}
class PushTokenDto {
  /** Expo push token, e.g. ExponentPushToken[xxxxxxxx] */
  @IsString() @MaxLength(200) @Matches(/^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$/)
  token: string;
}

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationService,
    private readonly sessions: SessionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'My notifications, newest first' })
  list(@CurrentUser('id') userId: string, @Query() q: ListQuery) {
    return this.notifications.list(userId, q);
  }

  @Get('unread-count')
  unread(@CurrentUser('id') userId: string) {
    return this.notifications.unreadCount(userId);
  }

  @Post('read')
  @HttpCode(200)
  read(@CurrentUser('id') userId: string, @Body() dto: ReadDto) {
    return this.notifications.markRead(userId, dto.ids);
  }

  @Put('push-token')
  @ApiOperation({ summary: 'Register this device for push notifications' })
  async setToken(@CurrentUser() user: { id: string; sid: string }, @Body() dto: PushTokenDto) {
    await this.sessions.setPushToken(user.sid, user.id, dto.token);
    return { success: true };
  }

  @Delete('push-token')
  @ApiOperation({ summary: 'Stop push notifications on this device' })
  async clearToken(@CurrentUser() user: { id: string; sid: string }) {
    await this.sessions.setPushToken(user.sid, user.id, null);
    return { success: true };
  }
}
