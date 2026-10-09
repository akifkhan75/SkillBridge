import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JobAccessService } from '../common/access/job-access.service';
import { DomainEvents } from '../common/events/domain-events';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: JobAccessService,
    private readonly events: DomainEvents,
  ) {}

  async markCashReceived(jobId: string, workerId: string, amount: number, currency: string = 'USD') {
    const job = await this.access.requireAssignedWorker(jobId, workerId);
    if (!['AWAITING_CONFIRMATION', 'COMPLETED'].includes(job.status)) {
      throw new BadRequestException('Job must be finished to mark cash received');
    }

    const payment = await this.prisma.payment.create({
      data: {
        jobRequestId: jobId,
        method: 'CASH',
        amount,
        currency,
        status: 'MARKED_BY_WORKER',
      },
    });

    return payment;
  }

  async confirmPayment(paymentId: string, customerId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { jobRequest: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.jobRequest.customerId !== customerId) {
      throw new ForbiddenException('Only the customer of this job can confirm payment');
    }
    if (payment.status !== 'MARKED_BY_WORKER') {
      throw new BadRequestException('Payment is not in a state to be confirmed');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'CONFIRMED' },
      });

      // Calculate commission (e.g. 10%)
      const commission = Math.floor(p.amount * 0.10);

      // Get current balance
      const lastLedger = await tx.ledgerEntry.findFirst({
        where: { workerId: payment.jobRequest.assignedWorkerId! },
        orderBy: { createdAt: 'desc' },
      });
      const balanceAfter = (lastLedger?.balanceAfter ?? 0) - commission;

      await tx.ledgerEntry.create({
        data: {
          workerId: payment.jobRequest.assignedWorkerId!,
          jobRequestId: payment.jobRequestId,
          type: 'COMMISSION_OWED',
          amount: -commission,
          currency: p.currency,
          balanceAfter,
          createdById: customerId,
        },
      });

      return p;
    });

    this.events.emit('payment.recorded', { jobId: payment.jobRequestId });

    return updated;
  }
}
