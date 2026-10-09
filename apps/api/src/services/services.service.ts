import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // Service Packages
  async findAllPackages() {
    return this.prisma.servicePackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPackageById(id: string) {
    const pkg = await this.prisma.servicePackage.findUnique({
      where: { id },
    });
    if (!pkg) {
      throw new NotFoundException('Service package not found');
    }
    return pkg;
  }

  // Subscription Plans
  async findAllPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPlanById(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }
}
