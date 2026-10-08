import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminVerificationService } from './admin-verification.service';
import { VerificationDecisionDto, VerificationQueryDto } from './dto/admin.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

/** Staff API. Everything here requires the admin role (RolesGuard) and is audited. */
@ApiTags('admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin/v1')
export class AdminController {
  constructor(private readonly verification: AdminVerificationService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Live counts for the dashboard' })
  stats() {
    return this.verification.stats();
  }

  @Get('verification-cases')
  @ApiOperation({ summary: 'Verification queue (oldest first)' })
  list(@Query() q: VerificationQueryDto) {
    return this.verification.list(q);
  }

  @Get('verification-cases/:id')
  @ApiOperation({ summary: 'Case with short-lived document links (audited)' })
  detail(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.verification.detail(id, adminId);
  }

  @Post('verification-cases/:id/decision')
  @ApiOperation({ summary: 'Approve, reject, or ask for more information' })
  decide(@Param('id') id: string, @CurrentUser('id') adminId: string, @Body() dto: VerificationDecisionDto) {
    return this.verification.decide(id, adminId, dto);
  }
}
