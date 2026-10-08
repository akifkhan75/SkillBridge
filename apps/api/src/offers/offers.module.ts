import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({ imports: [ChatModule], controllers: [OffersController], providers: [OffersService] })
export class OffersModule {}
