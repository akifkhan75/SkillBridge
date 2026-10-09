import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePropertyDto, CreateAssetDto, CreateWarrantyDto } from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  createProperty(userId: string, dto: CreatePropertyDto) {
    return this.prisma.property.create({ data: { ...dto, userId } });
  }

  getUserProperties(userId: string) {
    return this.prisma.property.findMany({
      where: { userId },
      include: { assets: { include: { warranties: true } } },
      take: 50,
    });
  }

  async addAsset(userId: string, propertyId: string, dto: CreateAssetDto) {
    const property = await this.prisma.property.findFirst({ where: { id: propertyId, userId }, select: { id: true } });
    if (!property) throw new NotFoundException('Property not found');
    return this.prisma.asset.create({
      data: { ...dto, installDate: dto.installDate ? new Date(dto.installDate) : undefined, propertyId },
    });
  }

  async addWarranty(userId: string, assetId: string, dto: CreateWarrantyDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id: assetId, property: { userId } },
      select: { id: true },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return this.prisma.warranty.create({
      data: { ...dto, expirationDate: new Date(dto.expirationDate), assetId },
    });
  }
}
