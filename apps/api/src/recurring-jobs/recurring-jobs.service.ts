import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RecurringJobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecurringJob(propertyId: string, data: any) {
    return this.prisma.recurringJob.create({
      data: {
        ...data,
        propertyId,
        nextExecutionDate: new Date(data.nextExecutionDate),
      }
    });
  }

  async getPropertyRecurringJobs(propertyId: string) {
    return this.prisma.recurringJob.findMany({
      where: { propertyId },
      include: { service: true }
    });
  }

  async cancelRecurringJob(id: string) {
    return this.prisma.recurringJob.update({
      where: { id },
      data: { isActive: false }
    });
  }

  // Admin/System endpoint to fetch all jobs that are due for execution
  async getDueJobs() {
    const today = new Date();
    return this.prisma.recurringJob.findMany({
      where: {
        isActive: true,
        nextExecutionDate: { lte: today }
      },
      include: {
        property: { include: { user: true } },
        service: true
      }
    });
  }
}
