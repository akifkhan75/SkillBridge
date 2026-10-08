import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JobAccessService } from '../common/access/job-access.service';
import { AuditService } from '../common/audit/audit.service';
import { CreateQuoteDto } from './dto/quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: JobAccessService,
    private readonly audit: AuditService,
  ) {}

  async create(workerId: string, dto: CreateQuoteDto) {
    const job = await this.access.requireAssignedWorker(dto.jobRequestId, workerId);
    if (!['AWAITING_WORKER', 'ACCEPTED', 'IN_PROGRESS'].includes(job.status)) {
      throw new ConflictException('A quote cannot be added to this job right now');
    }
    // Status is always PENDING on creation; the customer is the only one who can change it.
    return this.prisma.quote.create({
      data: {
        jobRequestId: dto.jobRequestId,
        totalAmount: dto.totalAmount,
        currency: dto.currency?.toUpperCase() ?? 'USD',
        details: dto.details,
        status: 'PENDING',
      },
    });
  }

  async findByJob(jobId: string, user: { id: string; type: string }) {
    await this.access.requireParticipant(jobId, user);
    return this.prisma.quote.findMany({
      where: { jobRequestId: jobId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async updateStatus(id: string, customerId: string, status: 'APPROVED' | 'REJECTED') {
    // Atomic: only a PENDING quote on this customer's own job can be decided, once.
    const result = await this.prisma.quote.updateMany({
      where: { id, status: 'PENDING', jobRequest: { customerId } },
      data: { status },
    });
    if (result.count === 0) {
      const quote = await this.prisma.quote.findFirst({
        where: { id, jobRequest: { customerId } },
        select: { id: true },
      });
      if (!quote) throw new NotFoundException('Quote not found');
      throw new ConflictException('This quote has already been decided');
    }
    await this.audit.record({
      actorId: customerId,
      action: `quote.${status.toLowerCase()}`,
      entityType: 'Quote',
      entityId: id,
    });
    return this.prisma.quote.findUnique({ where: { id } });
  }
}
