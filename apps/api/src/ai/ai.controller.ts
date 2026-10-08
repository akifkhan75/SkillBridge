import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { AnalyzeRequestDto, QuoteDraftDto, SafetyCheckDto, TranscribeDto } from './dto/analyze-request.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth()
@Throttle({ default: { limit: 10, ttl: 60_000 } })
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  @Roles('customer')
  @ApiOperation({ summary: 'Suggest category/urgency for a request and run safety rules (suggestion only)' })
  analyze(@CurrentUser('id') userId: string, @Body() dto: AnalyzeRequestDto) {
    return this.aiService.analyzeRequest(userId, dto);
  }

  @Post('transcribe')
  @Roles('customer', 'worker')
  @ApiOperation({ summary: 'Turn an uploaded voice note into text the user can edit' })
  transcribe(@CurrentUser('id') userId: string, @Body() dto: TranscribeDto) {
    return this.aiService.transcribe(userId, dto.uploadId, dto.locale);
  }

  @Post('safety-check')
  @Roles('customer')
  screenForSafety(@Body() dto: SafetyCheckDto) {
    return this.aiService.screenForSafety(dto.description);
  }

  @Post('quote-draft')
  @Roles('worker')
  generateQuoteDraft(@Body() dto: QuoteDraftDto) {
    return this.aiService.generateQuoteDraft(dto.jobDescription, dto.workerNotes);
  }
}
