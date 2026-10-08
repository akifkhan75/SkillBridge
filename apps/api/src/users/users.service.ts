import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateMeDto } from './dto/update-me.dto';

const SELECT = {
  id: true, name: true, email: true, phone: true, countryCode: true, locale: true,
  type: true, status: true, profileImageUrl: true, createdAt: true, updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  findAll() {
    return this.prisma.user.findMany({ select: SELECT, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(id: string, dto: UpdateMeDto) {
    const { name, locale } = dto;
    await this.prisma.$transaction(async (tx) => {
      let profileImageUrl: string | null | undefined;
      if (dto.avatarUploadId) {
        const [key] = await this.storage.consume(id, [dto.avatarUploadId], 'AVATAR', tx);
        profileImageUrl = key; // stored as a key; turned into a URL on the way out
      } else if (dto.removeAvatar) {
        profileImageUrl = null;
      }
      await tx.user.update({ where: { id }, data: { name: name?.trim(), locale, profileImageUrl } });
    });
    return this.findById(id);
  }
}
