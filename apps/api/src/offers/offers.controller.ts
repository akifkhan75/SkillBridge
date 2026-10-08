import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { OffersService } from './offers.service';
import { SubmitOfferDto } from './offer.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('offers')
@ApiBearerAuth()
@Controller()
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Get('workers/me/requests')
  @Roles('worker')
  @ApiOperation({ summary: 'Open requests sent to me, with my price if I sent one' })
  feed(@CurrentUser('id') workerId: string) {
    return this.offers.feed(workerId);
  }

  @Post('job-requests/:id/offers')
  @Roles('worker')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Send (or change) my price for a request I was matched to' })
  submit(@CurrentUser('id') workerId: string, @Param('id') jobId: string, @Body() dto: SubmitOfferDto) {
    return this.offers.submit(workerId, jobId, dto);
  }

  @Delete('job-requests/:id/offers/mine')
  @Roles('worker')
  withdraw(@CurrentUser('id') workerId: string, @Param('id') jobId: string) {
    return this.offers.withdraw(workerId, jobId);
  }

  @Post('job-requests/:id/not-interested')
  @Roles('worker')
  notInterested(@CurrentUser('id') workerId: string, @Param('id') jobId: string) {
    return this.offers.notInterested(workerId, jobId);
  }

  @Get('job-requests/:id/offers')
  @Roles('customer')
  @ApiOperation({ summary: 'The best live prices for my request' })
  list(@CurrentUser('id') customerId: string, @Param('id') jobId: string) {
    return this.offers.listForCustomer(customerId, jobId);
  }

  @Post('offers/:id/accept')
  @Roles('customer')
  @ApiOperation({ summary: 'Choose a price: books the job with that professional' })
  accept(@CurrentUser('id') customerId: string, @Param('id') offerId: string) {
    return this.offers.accept(customerId, offerId);
  }
}
