import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './providers/ai-provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new GeminiProvider(config.get<string>('GEMINI_API_KEY'), config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash'),
    },
  ],
  exports: [AiService],
})
export class AiModule {}
