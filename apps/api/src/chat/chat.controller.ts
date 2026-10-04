import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('threads')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get chat threads for authenticated user' })
  getMyThreads(@CurrentUser('id') userId: string) {
    return this.chatService.getThreadsForUser(userId);
  }

  @Get('threads/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get chat threads by user ID' })
  getThreadsByUserId(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      throw new UnauthorizedException('Unauthorized access to user threads');
    }
    return this.chatService.getThreadsByUserId(userId);
  }

  @Get('messages/:threadId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get messages in a thread' })
  getMessages(
    @Param('threadId') threadId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.getMessages(threadId, userId);
  }

  @Post('messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(
    @CurrentUser('id') senderId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(senderId, dto);
  }

  @Post('mark-read')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark messages as read' })
  markRead(
    @Body() dto: MarkReadDto,
    @CurrentUser('id') userId: string,
  ) {
    if (dto.userId !== userId) {
      throw new UnauthorizedException('Unauthorized access to mark read');
    }
    return this.chatService.markAsRead(dto);
  }
}
