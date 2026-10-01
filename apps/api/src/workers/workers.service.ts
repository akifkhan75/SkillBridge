import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { skill?: string; minRating?: number }) {
    const where: any = { activationStatus: 'ACTIVE' };

    if (filters?.skill) {
      where.skills = { has: filters.skill };
    }
    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }

    return this.prisma.worker.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImageUrl: true },
        },
      },
    });
  }

  async findById(id: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImageUrl: true },
        },
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return worker;
  }

  async update(id: string, userId: string, userType: string, dto: UpdateWorkerDto) {
    if (userId !== id && userType !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }

    const worker = await this.prisma.worker.findUnique({ where: { id } });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return this.prisma.worker.update({
      where: { id },
      data: dto as any,
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImageUrl: true },
        },
      },
    });
  }

  async findMatchingWorkers(jobType: string, limit = 3) {
    const workers = await this.prisma.worker.findMany({
      where: {
        activationStatus: 'ACTIVE',
        isOnline: true,
        skills: { has: jobType as any },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImageUrl: true },
        },
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });

    return workers;
  }
}
