import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DisputesService } from './disputes.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('disputes')
@Controller('disputes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a new dispute (Customer/Worker)' })
  createDispute(
    @CurrentUser('id') userId: string,
    @Body() body: { jobRequestId: string; reason: string; description?: string }
  ) {
    return this.disputesService.createDispute(userId, body);
  }

  @Get('my-disputes')
  @ApiOperation({ summary: 'Get disputes raised by current user' })
  getMyDisputes(@CurrentUser('id') userId: string) {
    return this.disputesService.getUserDisputes(userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all disputes (Admin only)' })
  getAllDisputes(@CurrentUser('type') type: string) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.disputesService.getAllDisputes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dispute by ID' })
  getDisputeById(@Param('id') id: string) {
    return this.disputesService.getDisputeById(id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve/Update a dispute (Admin only)' })
  updateDisputeStatus(
    @CurrentUser('type') type: string,
    @Param('id') id: string,
    @Body() body: { status: string; resolution?: string }
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.disputesService.updateDisputeStatus(id, body.status, body.resolution);
  }
}
