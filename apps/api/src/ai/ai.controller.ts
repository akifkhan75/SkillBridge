import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';

@ApiTags('ai')
@Controller('ai')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a service request using AI' })
  analyze(@Body() dto: AnalyzeRequestDto) {
    return this.aiService.analyzeServiceRequest(dto.description, dto.imageBase64);
  }

  @Post('safety-check')
  @ApiOperation({ summary: 'Screen a service request description for safety/emergencies' })
  screenForSafety(@Body('description') description: string) {
    return this.aiService.screenForSafety(description);
  }

  @Post('quote-draft')
  @ApiOperation({ summary: 'Generate a professional quote draft' })
  generateQuoteDraft(
    @Body('jobDescription') jobDescription: string,
    @Body('workerNotes') workerNotes: string
  ) {
    return this.aiService.generateQuoteDraft(jobDescription, workerNotes);
  }

  @Post('transcribe')
  @ApiOperation({ summary: 'Transcribe audio to text' })
  async transcribeAudio(
    @Body('audioBase64') audioBase64: string,
    @Body('mimeType') mimeType: string,
  ) {
    const text = await this.aiService.transcribeAudio(audioBase64, mimeType);
    return { text };
  }
}
