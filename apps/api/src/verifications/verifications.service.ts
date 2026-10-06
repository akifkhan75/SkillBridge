import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VerificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async submitVerification(workerId: string, type: 'id' | 'background' | 'references') {
    const data: any = {};
    if (type === 'id') data.idVerifiedStatus = 'SUBMITTED';
    if (type === 'background') data.backgroundCheckStatus = 'SUBMITTED';
    if (type === 'references') data.referencesStatus = 'SUBMITTED';

    return this.prisma.worker.update({
      where: { id: workerId },
      data,
    });
  }

  async getPendingVerifications() {
    return this.prisma.worker.findMany({
      where: {
        OR: [
          { idVerifiedStatus: 'SUBMITTED' },
          { backgroundCheckStatus: 'SUBMITTED' },
          { referencesStatus: 'SUBMITTED' },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  async updateVerificationStatus(
    workerId: string, 
    type: 'id' | 'background' | 'references', 
    status: 'CHECKED' | 'VERIFIED' | 'NONE'
  ) {
    const data: any = {};
    if (type === 'id') data.idVerifiedStatus = status;
    if (type === 'background') data.backgroundCheckStatus = status;
    if (type === 'references') data.referencesStatus = status;

    const worker = await this.prisma.worker.update({
      where: { id: workerId },
      data,
    });

    if (
      worker.idVerifiedStatus === 'VERIFIED' && 
      worker.backgroundCheckStatus === 'VERIFIED'
    ) {
      await this.prisma.worker.update({
        where: { id: workerId },
        data: { isVerified: true, activationStatus: 'ACTIVE' }
      });
    }

    return worker;
  }
}
