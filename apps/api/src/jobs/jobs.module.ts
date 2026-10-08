import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ChatModule } from '../chat/chat.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [ChatModule, MatchingModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
