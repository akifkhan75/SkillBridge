import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ChangeOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workerId: string, data: any) {
    const jobRequest = await this.prisma.jobRequest.findUnique({
      where: { id: data.jobRequestId }
    });

    if (!jobRequest) {
      throw new NotFoundException('Job request not found');
    }

    if (jobRequest.assignedWorkerId && jobRequest.assignedWorkerId !== workerId) {
      throw new ForbiddenException('Not assigned to this job');
    }

    return this.prisma.changeOrder.create({
      data: {
        ...data,
      },
    });
  }

  async findByJob(jobRequestId: string) {
    return this.prisma.changeOrder.findMany({
      where: { jobRequestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, customerId: string, status: string) {
    const changeOrder = await this.prisma.changeOrder.findUnique({
      where: { id },
      include: { jobRequest: true }
    });

    if (!changeOrder || changeOrder.jobRequest.customerId !== customerId) {
      throw new NotFoundException('Change order not found or access denied');
    }

    return this.prisma.changeOrder.update({
      where: { id },
      data: { status },
    });
  }
}
