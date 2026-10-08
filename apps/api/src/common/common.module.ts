import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit/audit.service';
import { JobAccessService } from './access/job-access.service';

@Global()
@Module({
  providers: [AuditService, JobAccessService],
  exports: [AuditService, JobAccessService],
})
export class CommonModule {}
