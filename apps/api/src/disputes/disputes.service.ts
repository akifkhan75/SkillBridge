import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDispute(userId: string, data: { jobRequestId: string; reason: string; description?: string }) {
    return this.prisma.dispute.create({
      data: {
        ...data,
        raisedById: userId,
      }
    });
  }

  async getDisputeById(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        raisedBy: { select: { id: true, name: true, type: true } },
        jobRequest: true
      }
    });

    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  async getUserDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: { raisedById: userId },
      include: {
        jobRequest: { select: { id: true, customerName: true, status: true } }
      }
    });
  }

  async getAllDisputes() {
    return this.prisma.dispute.findMany({
      include: {
        raisedBy: { select: { id: true, name: true, type: true } },
        jobRequest: { select: { id: true, customerName: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateDisputeStatus(id: string, status: string, resolution?: string) {
    return this.prisma.dispute.update({
      where: { id },
      data: { status, resolution }
    });
  }
}
