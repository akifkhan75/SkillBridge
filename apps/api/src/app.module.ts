import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkersModule } from './workers/workers.module';
import { JobsModule } from './jobs/jobs.module';
import { ChatModule } from './chat/chat.module';
import { ServicesModule } from './services/services.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AddressesModule } from './addresses/addresses.module';
import { QuotesModule } from './quotes/quotes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChangeOrdersModule } from './change-orders/change-orders.module';
import { VerificationsModule } from './verifications/verifications.module';
import { DisputesModule } from './disputes/disputes.module';
import { ServiceCatalogModule } from './service-catalog/service-catalog.module';
import { PropertiesModule } from './properties/properties.module';
import { RecurringJobsModule } from './recurring-jobs/recurring-jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    WorkersModule,
    JobsModule,
    ChatModule,
    ServicesModule,
    AiModule,
    AddressesModule,
    QuotesModule,
    ReviewsModule,
    ChangeOrdersModule,
    VerificationsModule,
    DisputesModule,
    ServiceCatalogModule,
    PropertiesModule,
    RecurringJobsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
