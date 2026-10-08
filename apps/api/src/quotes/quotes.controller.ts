import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, DecideDto } from './dto/quote.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @Roles('worker')
  @ApiOperation({ summary: 'Submit a quote for a job assigned to you (workers)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(userId, dto);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Quotes for a job you are part of' })
  findByJob(@Param('jobId') jobId: string, @CurrentUser() user: { id: string; type: string }) {
    return this.quotesService.findByJob(jobId, user);
  }

  @Patch(':id/status')
  @Roles('customer')
  @ApiOperation({ summary: 'Approve or reject a pending quote (customer)' })
  updateStatus(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: DecideDto) {
    return this.quotesService.updateStatus(id, userId, dto.status);
  }
}
