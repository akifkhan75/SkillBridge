import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ChatService } from '../chat.service';
import { PrismaService } from '../../database/prisma.service';

class SendMessagePayload {
  @IsString() @IsNotEmpty() @MaxLength(64) threadId: string;
  @IsString() @IsNotEmpty() @MaxLength(4000) text: string;
}
class ThreadPayload {
  @IsString() @IsNotEmpty() @MaxLength(64) threadId: string;
}
class LocationPayload {
  @IsString() @IsNotEmpty() @MaxLength(64) jobId: string;
  @IsLatitude() latitude: number;
  @IsLongitude() longitude: number;
  @IsOptional() @IsNumber() heading?: number;
}

function parse<T extends object>(cls: new () => T, data: unknown): T | null {
  const obj = plainToInstance(cls, data);
  return validateSync(obj as object, { whitelist: true, forbidNonWhitelisted: true }).length ? null : obj;
}

interface AuthedSocket extends Socket {
  data: { userId: string; userType: string };
}

/**
 * Identity comes only from a verified JWT in the handshake; the client never states who it is.
 * Rooms are assigned by the server: user:{id} and role:{type}.
 */
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    // Evaluated per handshake (env is not loaded when decorators run). Native apps send no Origin.
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      const allowed = (process.env.FRONTEND_URL ?? '').split(',').map((o) => o.trim()).filter(Boolean);
      cb(null, !origin || allowed.includes(origin));
    },
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token as string | undefined) ?? '';
      const payload = this.jwt.verify<{ sub: string; sid?: string }>(token);
      // Must belong to a live session, so signing out / "sign out other devices" cuts sockets too.
      const session = await this.prisma.session.findFirst({
        where: {
          id: payload.sid ?? '',
          userId: payload.sub,
          revokedAt: null,
          expiresAt: { gt: new Date() },
          user: { status: 'ACTIVE' },
        },
        select: { user: { select: { id: true, type: true } } },
      });
      if (!session) throw new Error('no live session');
      const user = session.user;

      client.data.userId = user.id;
      client.data.userType = user.type;
      await client.join([`user:${user.id}`, `role:${user.type}`]);
    } catch {
      client.emit('error', { code: 'UNAUTHORIZED' });
      client.disconnect(true);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@ConnectedSocket() client: AuthedSocket, @MessageBody() raw: unknown) {
    const data = parse(SendMessagePayload, raw);
    if (!data || !client.data.userId) return { error: 'INVALID' };

    const message = await this.chatService.sendMessage(client.data.userId, data);
    this.server.to(`user:${message.receiverId}`).emit('newMessage', message);
    client.emit('messageSent', message);
    return message;
  }

  @SubscribeMessage('typing')
  async handleTyping(@ConnectedSocket() client: AuthedSocket, @MessageBody() raw: unknown) {
    const data = parse(ThreadPayload, raw);
    if (!data || !client.data.userId) return;
    const thread = await this.chatService.requireThread(data.threadId, client.data.userId).catch(() => null);
    const other = thread?.participants.find((p) => p.id !== client.data.userId);
    if (other) this.server.to(`user:${other.id}`).emit('userTyping', { threadId: data.threadId, userId: client.data.userId });
  }

  /**
   * A worker may broadcast their position only to the customer of a job that worker is
   * actively assigned to. The receiver is derived from the job, never trusted from the client.
   */
  @SubscribeMessage('locationUpdate')
  async handleLocationUpdate(@ConnectedSocket() client: AuthedSocket, @MessageBody() raw: unknown) {
    const data = parse(LocationPayload, raw);
    if (!data || client.data.userType !== 'worker') return;

    const job = await this.prisma.jobRequest.findFirst({
      where: { id: data.jobId, assignedWorkerId: client.data.userId, status: { in: ['ACCEPTED', 'IN_PROGRESS'] } },
      select: { customerId: true },
    });
    if (!job) return;

    this.server.to(`user:${job.customerId}`).emit('locationUpdate', {
      workerId: client.data.userId,
      jobId: data.jobId,
      latitude: data.latitude,
      longitude: data.longitude,
      heading: data.heading,
    });
  }
}
