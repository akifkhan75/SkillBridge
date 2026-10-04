import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, userName: string, dto: CreateJobDto) {
    return this.prisma.jobRequest.create({
      data: {
        customerId: userId,
        customerName: userName || 'Customer',
        description: dto.description,
        jobType: dto.jobType as any,
        location: dto.location,
        requestedDate: dto.requestedDate,
        urgency: dto.urgency,
        severity: dto.severity,
        estimatedDuration: dto.estimatedDuration,
        priceEstimate: dto.priceEstimate,
        status: 'MATCHES_FOUND',
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(userId: string, userType: string, filters?: { status?: string; jobType?: string }) {
    const where: any = {};

    if (userType === 'customer') {
      where.customerId = userId;
    }

    if (filters?.status) where.status = filters.status;
    if (filters?.jobType) where.jobType = filters.jobType;

    return this.prisma.jobRequest.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        assignedWorker: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string, userType: string) {
    const job = await this.prisma.jobRequest.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        assignedWorker: { include: { user: true } },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (userType === 'customer' && job.customerId !== userId) {
      throw new NotFoundException('Job not found'); // Use 404 to not leak existence
    }

    if (userType === 'worker') {
      // Workers can see jobs that are unassigned (open market) OR assigned to them
      if (job.assignedWorkerId && job.assignedWorkerId !== userId) {
        throw new NotFoundException('Job not found');
      }
    }

    return job;
  }

  async update(id: string, dto: UpdateJobDto, userId: string, userType: string) {
    const job = await this.prisma.jobRequest.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (userType === 'customer' && job.customerId !== userId) {
      throw new NotFoundException('Job not found');
    }

    if (userType === 'worker') {
      // Worker can only update if it is assigned to them, or if they are accepting an open job
      const isAccepting = !job.assignedWorkerId && dto.assignedWorkerId === userId;
      if (!isAccepting && job.assignedWorkerId !== userId) {
        throw new NotFoundException('Job not found');
      }
    }

    return this.prisma.jobRequest.update({
      where: { id },
      data: dto as any,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        assignedWorker: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
      },
    });
  }
}
