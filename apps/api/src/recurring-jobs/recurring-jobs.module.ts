import { Module } from '@nestjs/common';
import { RecurringJobsService } from './recurring-jobs.service';
import { RecurringJobsController } from './recurring-jobs.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RecurringJobsController],
  providers: [RecurringJobsService],
})
export class RecurringJobsModule {}
