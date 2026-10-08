import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit/audit.service';
import { JobAccessService } from './access/job-access.service';
import { DomainEvents } from './events/domain-events';

@Global()
@Module({
  providers: [AuditService, JobAccessService, DomainEvents],
  exports: [AuditService, JobAccessService, DomainEvents],
})
export class CommonModule {}
