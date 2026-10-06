import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProperty(userId: string, data: any) {
    return this.prisma.property.create({
      data: { ...data, userId }
    });
  }

  async getUserProperties(userId: string) {
    return this.prisma.property.findMany({
      where: { userId },
      include: { assets: { include: { warranties: true } } }
    });
  }

  async addAsset(propertyId: string, data: any) {
    return this.prisma.asset.create({
      data: { ...data, propertyId }
    });
  }

  async addWarranty(assetId: string, data: any) {
    return this.prisma.warranty.create({
      data: { ...data, assetId, expirationDate: new Date(data.expirationDate) }
    });
  }
}
