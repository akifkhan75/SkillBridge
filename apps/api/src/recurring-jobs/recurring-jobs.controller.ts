import { Controller, Get, Post, Body, Param, UseGuards, Patch, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RecurringJobsService } from './recurring-jobs.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('recurring-jobs')
@Controller('recurring-jobs')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RecurringJobsController {
  constructor(private readonly recurringJobsService: RecurringJobsService) {}

  @Post('property/:propertyId')
  @ApiOperation({ summary: 'Setup a recurring job for a property' })
  createRecurringJob(@Param('propertyId') propertyId: string, @Body() body: any) {
    return this.recurringJobsService.createRecurringJob(propertyId, body);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get recurring jobs for a property' })
  getPropertyRecurringJobs(@Param('propertyId') propertyId: string) {
    return this.recurringJobsService.getPropertyRecurringJobs(propertyId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a recurring job' })
  cancelRecurringJob(@Param('id') id: string) {
    return this.recurringJobsService.cancelRecurringJob(id);
  }

  @Get('system/due')
  @ApiOperation({ summary: 'Get all due recurring jobs (System/Admin)' })
  getDueJobs(@CurrentUser('type') type: string) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.recurringJobsService.getDueJobs();
  }
}
