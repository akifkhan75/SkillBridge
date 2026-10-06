import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QuotesService } from './quotes.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('quotes')
@Controller('quotes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new quote (Workers only)' })
  create(@CurrentUser('id') userId: string, @CurrentUser('type') userType: string, @Body() data: any) {
    if (userType !== 'worker') throw new ForbiddenException('Only workers can create quotes');
    return this.quotesService.create(userId, data);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get all quotes for a job' })
  findByJob(@Param('jobId') jobId: string) {
    return this.quotesService.findByJob(jobId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or reject quote (Customers only)' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type') userType: string,
    @Body('status') status: string
  ) {
    if (userType !== 'customer') throw new ForbiddenException('Only customers can approve quotes');
    return this.quotesService.updateStatus(id, userId, status);
  }
}
