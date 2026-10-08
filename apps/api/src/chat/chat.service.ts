import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  getThreadsForUser(userId: string) {
    return this.prisma.chatThread.findMany({
      where: { participants: { some: { id: userId } } },
      include: {
        participants: { select: { id: true, name: true, profileImageUrl: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: 100,
    });
  }

  /** Thread if (and only if) the user participates; 404 otherwise so existence is not leaked. */
  async requireThread(threadId: string, userId: string) {
    const thread = await this.prisma.chatThread.findFirst({
      where: { id: threadId, participants: { some: { id: userId } } },
      include: { participants: { select: { id: true } } },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async getMessages(threadId: string, userId: string) {
    await this.requireThread(threadId, userId);
    return this.prisma.chatMessage.findMany({
      where: { threadId },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }

  async sendMessage(senderId: string, dto: Pick<SendMessageDto, 'threadId' | 'text'>) {
    const thread = await this.requireThread(dto.threadId, senderId);
    const receiver = thread.participants.find((p) => p.id !== senderId);
    if (!receiver) throw new NotFoundException('Thread not found');

    const [message] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: { threadId: dto.threadId, senderId, receiverId: receiver.id, text: dto.text },
        include: { sender: { select: { id: true, name: true } } },
      }),
      this.prisma.chatThread.update({
        where: { id: dto.threadId },
        data: { lastMessageAt: new Date() },
      }),
    ]);
    return message;
  }

  async markAsRead(threadId: string, userId: string) {
    await this.requireThread(threadId, userId);
    await this.prisma.chatMessage.updateMany({
      where: { threadId, receiverId: userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }
}
