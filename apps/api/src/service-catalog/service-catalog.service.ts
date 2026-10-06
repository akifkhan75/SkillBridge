import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ServiceCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(includeInactive: boolean = false) {
    return this.prisma.serviceCategory.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        services: {
          where: includeInactive ? undefined : { isActive: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id },
      include: { services: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(data: { name: string; description?: string; iconName?: string }) {
    return this.prisma.serviceCategory.create({ data });
  }

  async updateCategory(id: string, data: { name?: string; description?: string; iconName?: string; isActive?: boolean }) {
    return this.prisma.serviceCategory.update({
      where: { id },
      data,
    });
  }

  async addServiceToCategory(categoryId: string, data: { name: string; description?: string; basePrice?: number }) {
    return this.prisma.service.create({
      data: {
        ...data,
        categoryId,
      },
    });
  }

  async updateService(serviceId: string, data: { name?: string; description?: string; basePrice?: number; isActive?: boolean }) {
    return this.prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }
}
