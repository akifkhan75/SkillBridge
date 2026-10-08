import { Controller, Get, Post, Body, Param, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('threads')
  @ApiOperation({ summary: 'Your chat threads' })
  getMyThreads(@CurrentUser('id') userId: string) {
    return this.chatService.getThreadsForUser(userId);
  }

  @Get('threads/:userId')
  @ApiOperation({ summary: 'Your chat threads (path form kept for older clients)' })
  getThreadsByUserId(@Param('userId') userId: string, @CurrentUser('id') currentUserId: string) {
    if (userId !== currentUserId) throw new ForbiddenException('You can only read your own threads');
    return this.chatService.getThreadsForUser(userId);
  }

  @Get('messages/:threadId')
  @ApiOperation({ summary: 'Messages in a thread you belong to' })
  getMessages(@Param('threadId') threadId: string, @CurrentUser('id') userId: string) {
    return this.chatService.getMessages(threadId, userId);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message in a thread you belong to' })
  sendMessage(@CurrentUser('id') senderId: string, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(senderId, dto);
  }

  @Post('mark-read')
  @ApiOperation({ summary: 'Mark a thread as read for you' })
  markRead(@Body() dto: MarkReadDto, @CurrentUser('id') userId: string) {
    return this.chatService.markAsRead(dto.threadId, userId);
  }
}
