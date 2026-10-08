import { Controller, Post, Param, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('job/:id/cash')
  @Roles('worker')
  @ApiOperation({ summary: 'Worker marks cash received' })
  markCashReceived(
    @Param('id') jobId: string,
    @CurrentUser('id') workerId: string,
    @Body() dto: { amount: number; currency?: string },
  ) {
    return this.paymentsService.markCashReceived(jobId, workerId, dto.amount, dto.currency);
  }

  @Post(':id/confirm')
  @Roles('customer')
  @ApiOperation({ summary: 'Customer confirms payment' })
  confirmPayment(
    @Param('id') paymentId: string,
    @CurrentUser('id') customerId: string,
  ) {
    return this.paymentsService.confirmPayment(paymentId, customerId);
  }
}
