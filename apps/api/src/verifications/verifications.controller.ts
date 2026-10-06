import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VerificationsService } from './verifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('verifications')
@Controller('verifications')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Worker submits verification documents' })
  submitVerification(
    @CurrentUser('id') userId: string,
    @CurrentUser('type') type: string,
    @Body('documentType') documentType: 'id' | 'background' | 'references'
  ) {
    if (type !== 'worker') throw new ForbiddenException('Only workers can submit verifications');
    return this.verificationsService.submitVerification(userId, documentType);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Admin gets all pending verifications' })
  getPendingVerifications(@CurrentUser('type') type: string) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.verificationsService.getPendingVerifications();
  }

  @Patch(':workerId/status')
  @ApiOperation({ summary: 'Admin approves or rejects verification' })
  updateVerificationStatus(
    @CurrentUser('type') type: string,
    @Param('workerId') workerId: string,
    @Body('documentType') documentType: 'id' | 'background' | 'references',
    @Body('status') status: 'CHECKED' | 'VERIFIED' | 'NONE'
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.verificationsService.updateVerificationStatus(workerId, documentType, status);
  }
}
