import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSocketMap.set(userId, client.id);
      console.log(`User ${userId} connected to chat via WebSocket`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.userSocketMap.entries()].find(
      ([_, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.userSocketMap.delete(userId);
      console.log(`User ${userId} disconnected from chat`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { threadId: string; receiverId: string; text: string },
  ) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    const message = await this.chatService.sendMessage(userId, data);

    // Emit to receiver if online
    const receiverSocketId = this.userSocketMap.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }

    // Confirm to sender
    client.emit('messageSent', message);

    return message;
  }

  @SubscribeMessage('joinThread')
  handleJoinThread(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { threadId: string },
  ) {
    client.join(`thread:${data.threadId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { threadId: string; receiverId: string },
  ) {
    const receiverSocketId = this.userSocketMap.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('userTyping', {
        threadId: data.threadId,
        userId: client.handshake.query.userId,
      });
    }
  }

  @SubscribeMessage('locationUpdate')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; latitude: number; longitude: number; heading?: number },
  ) {
    const receiverSocketId = this.userSocketMap.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('locationUpdate', {
        workerId: client.handshake.query.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
      });
    }
  }
}
