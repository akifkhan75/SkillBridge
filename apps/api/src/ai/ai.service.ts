import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ServiceAnalysisResult {
  jobType: string;
  urgency: string;
  severity: string;
  estimatedDuration: string;
  priceEstimate: string;
  isEmergency: boolean;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.logger.log('Gemini AI initialized successfully');
    } else {
      this.logger.warn('GEMINI_API_KEY not set — AI analysis will return defaults');
    }
  }

  async analyzeServiceRequest(description: string, imageBase64?: string): Promise<ServiceAnalysisResult> {
    if (!this.model) {
      return this.getDefaultAnalysis();
    }

    const jobCategories = 'Plumbing, Electrical, Carpentry, Mechanics, Painting, Cleaning, HVAC, General Handyman, Salon, Car Services, Other';
    const urgencyLevels = 'Low, Medium, High, Emergency';
    const severityLevels = 'Minor, Moderate, Major, Critical';
    const priceEstimates = 'Affordable, Moderate, Premium, Requires Quote';

    const prompt = `
      Analyze this service request and respond in JSON format with these properties:
      - jobType (possible values: ${jobCategories})
      - urgency (possible values: ${urgencyLevels})
      - severity (possible values: ${severityLevels})
      - estimatedDuration (e.g., "1-2 hours", "half a day")
      - priceEstimate (possible values: ${priceEstimates})
      - isEmergency (boolean, true if this is an active, dangerous emergency like a major water leak, fire hazard, or security issue)
      
      Rules:
      1. If unsure, pick the most general/moderate option
      2. For complex jobs, set priceEstimate to "Requires Quote"
      3. Keep durations reasonable
      4. Only set isEmergency to true if it genuinely requires immediate, drop-everything priority dispatch.
      
      Service Request Description: "${description}"
      ${imageBase64 ? 'The user has also attached an image of the issue for context.' : ''}
      
      Respond ONLY with valid JSON like this:
      {
        "jobType": "...",
        "urgency": "...",
        "severity": "...",
        "estimatedDuration": "...",
        "priceEstimate": "...",
        "isEmergency": false
      }
    `;

    try {
      const parts: any[] = [{ text: prompt }];
      
      if (imageBase64) {
        // Strip the data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg' // we assume jpeg/png
          }
        });
      }

      const result = await this.model.generateContent(parts);
      const response = await result.response;
      const text = response.text();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonStr);

      return {
        jobType: parsed.jobType || 'Other',
        urgency: parsed.urgency || 'Medium',
        severity: parsed.severity || 'Moderate',
        estimatedDuration: parsed.estimatedDuration || 'Not Estimated',
        priceEstimate: parsed.priceEstimate || 'Requires Quote',
        isEmergency: !!parsed.isEmergency,
      };
    } catch (error) {
      this.logger.error('Gemini API error:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): ServiceAnalysisResult {
    return {
      jobType: 'Other',
      urgency: 'Medium',
      severity: 'Moderate',
      estimatedDuration: 'Not Estimated',
      priceEstimate: 'Requires Quote',
      isEmergency: false,
    };
  }
}
