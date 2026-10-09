import { Module } from '@nestjs/common';
import { ChangeOrdersService } from './change-orders.service';
import { ChangeOrdersController } from './change-orders.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChangeOrdersController],
  providers: [ChangeOrdersService],
})
export class ChangeOrdersModule {}
