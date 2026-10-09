import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { RealtimeService } from '../realtime/realtime.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, RealtimeService],
  exports: [ChatService, ChatGateway, RealtimeService],
})
export class ChatModule {}
