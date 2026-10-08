import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto, CreateServiceDto, UpdateCategoryDto, UpdateServiceDto } from './dto/catalog.dto';

const CATEGORY_INCLUDE = (includeInactive: boolean) => ({
  services: { where: includeInactive ? undefined : { isActive: true }, orderBy: [{ sortOrder: 'asc' as const }, { name: 'asc' as const }] },
  issues: { where: includeInactive ? undefined : { isActive: true }, orderBy: [{ sortOrder: 'asc' as const }, { name: 'asc' as const }] },
});

@Injectable()
export class ServiceCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategories(includeInactive = false) {
    return this.prisma.serviceCategory.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: CATEGORY_INCLUDE(includeInactive),
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.serviceCategory.findFirst({
      where: { id, isActive: true },
      include: CATEGORY_INCLUDE(false),
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  createCategory(data: CreateCategoryDto) {
    return this.prisma.serviceCategory.create({ data });
  }

  updateCategory(id: string, data: UpdateCategoryDto) {
    return this.prisma.serviceCategory.update({ where: { id }, data });
  }

  addServiceToCategory(categoryId: string, data: CreateServiceDto) {
    return this.prisma.service.create({ data: { ...data, categoryId } });
  }

  updateService(serviceId: string, data: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id: serviceId }, data });
  }
}
