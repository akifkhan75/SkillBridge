import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class QuotesService {
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

    return this.prisma.quote.create({
      data: {
        ...data,
      },
    });
  }

  async findByJob(jobRequestId: string) {
    return this.prisma.quote.findMany({
      where: { jobRequestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, customerId: string, status: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: { jobRequest: true }
    });

    if (!quote || quote.jobRequest.customerId !== customerId) {
      throw new NotFoundException('Quote not found or access denied');
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status },
    });
  }
}
