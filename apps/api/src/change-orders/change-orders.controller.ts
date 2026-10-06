import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChangeOrdersService } from './change-orders.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('change-orders')
@Controller('change-orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ChangeOrdersController {
  constructor(private readonly changeOrdersService: ChangeOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new change order (Workers only)' })
  create(@CurrentUser('id') userId: string, @CurrentUser('type') userType: string, @Body() data: any) {
    if (userType !== 'worker') throw new ForbiddenException('Only workers can create change orders');
    return this.changeOrdersService.create(userId, data);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get all change orders for a job' })
  findByJob(@Param('jobId') jobId: string) {
    return this.changeOrdersService.findByJob(jobId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or reject change order (Customers only)' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type') userType: string,
    @Body('status') status: string
  ) {
    if (userType !== 'customer') throw new ForbiddenException('Only customers can approve change orders');
    return this.changeOrdersService.updateStatus(id, userId, status);
  }
}
