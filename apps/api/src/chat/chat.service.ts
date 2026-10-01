import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getThreadsForUser(userId: string) {
    return this.prisma.chatThread.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: { id: true, name: true, profileImageUrl: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getThreadsByUserId(userId: string) {
    return this.prisma.chatThread.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: { id: true, name: true, profileImageUrl: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getMessages(threadId: string) {
    const thread = await this.prisma.chatThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return this.prisma.chatMessage.findMany({
      where: { threadId },
      include: {
        sender: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const message = await this.prisma.chatMessage.create({
      data: {
        threadId: dto.threadId,
        senderId,
        receiverId: dto.receiverId,
        text: dto.text,
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    await this.prisma.chatThread.update({
      where: { id: dto.threadId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async markAsRead(dto: MarkReadDto) {
    await this.prisma.chatMessage.updateMany({
      where: {
        threadId: dto.threadId,
        receiverId: dto.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }
}
