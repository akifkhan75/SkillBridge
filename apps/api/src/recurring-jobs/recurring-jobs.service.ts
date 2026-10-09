import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRecurringJobDto } from './dto/recurring-job.dto';

@Injectable()
export class RecurringJobsService {
  constructor(private readonly prisma: PrismaService) {}

  private async requireOwnProperty(userId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({ where: { id: propertyId, userId }, select: { id: true } });
    if (!property) throw new NotFoundException('Property not found');
  }

  async createRecurringJob(userId: string, propertyId: string, dto: CreateRecurringJobDto) {
    await this.requireOwnProperty(userId, propertyId);
    return this.prisma.recurringJob.create({
      data: { ...dto, propertyId, nextExecutionDate: new Date(dto.nextExecutionDate) },
    });
  }

  async getPropertyRecurringJobs(userId: string, propertyId: string) {
    await this.requireOwnProperty(userId, propertyId);
    return this.prisma.recurringJob.findMany({
      where: { propertyId },
      include: { service: true },
      take: 50,
    });
  }

  async cancelRecurringJob(userId: string, id: string) {
    const result = await this.prisma.recurringJob.updateMany({
      where: { id, property: { userId } },
      data: { isActive: false },
    });
    if (result.count === 0) throw new NotFoundException('Recurring job not found');
    return this.prisma.recurringJob.findUnique({ where: { id } });
  }

  getDueJobs() {
    return this.prisma.recurringJob.findMany({
      where: { isActive: true, nextExecutionDate: { lte: new Date() } },
      include: { property: { select: { id: true, userId: true } }, service: true },
      take: 500,
    });
  }
}
