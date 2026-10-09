import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChangeOrdersService } from './change-orders.service';
import { CreateChangeOrderDto, DecideDto } from './dto/change-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('change-orders')
@ApiBearerAuth()
@Controller('change-orders')
export class ChangeOrdersController {
  constructor(private readonly changeOrdersService: ChangeOrdersService) {}

  @Post()
  @Roles('worker')
  @ApiOperation({ summary: 'Request extra work on your assigned job (workers)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateChangeOrderDto) {
    return this.changeOrdersService.create(userId, dto);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Change orders for a job you are part of' })
  findByJob(@Param('jobId') jobId: string, @CurrentUser() user: { id: string; type: string }) {
    return this.changeOrdersService.findByJob(jobId, user);
  }

  @Patch(':id/status')
  @Roles('customer')
  @ApiOperation({ summary: 'Approve or reject a pending change order (customer)' })
  updateStatus(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: DecideDto) {
    return this.changeOrdersService.updateStatus(id, userId, dto.status);
  }
}
