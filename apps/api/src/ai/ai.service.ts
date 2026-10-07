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

  async generateQuoteDraft(jobDescription: string, workerNotes: string): Promise<string> {
    if (!this.model) return 'AI not configured. Please write your quote manually.';

    const prompt = `
      You are an AI assistant helping a professional tradesperson write a polite, professional, and clear price quote for a customer.
      
      Job Description from customer: "${jobDescription}"
      Notes from the professional: "${workerNotes}"
      
      Draft a professional message that includes the quote breakdown and explains the work to be done. Keep it concise, friendly, and structured. Do NOT use markdown code blocks, just plain text.
    `;
    
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Gemini Quote error:', error);
      return 'Failed to generate quote draft.';
    }
  }

  async screenForSafety(description: string): Promise<{ isSafe: boolean; flagReason?: string }> {
    if (!this.model) return { isSafe: true };

    const prompt = `
      Analyze this service request description for safety hazards, illegal activities, or extreme emergencies that require 911 rather than a tradesperson (e.g., active house fire, active shooter, extreme gas leak).
      
      Description: "${description}"
      
      Respond ONLY in valid JSON format exactly like this:
      {
        "isSafe": boolean (false if hazardous/illegal/extreme emergency),
        "flagReason": string (brief explanation if not safe, otherwise null)
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd));
      return {
        isSafe: !!parsed.isSafe,
        flagReason: parsed.flagReason || undefined
      };
    } catch (error) {
      this.logger.error('Gemini Safety Check error:', error);
      return { isSafe: true }; // default to safe if AI fails
    }
  }

  async transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
    if (!this.model) return 'AI not configured.';
    
    const prompt = 'Please provide an exact transcription of this audio. Return ONLY the transcribed text without any conversational filler, explanation, or quotes. Ensure your response is just the transcription.';
    
    try {
      const parts: any[] = [{ text: prompt }];
      
      // Strip any data URI prefix just in case it was passed
      const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'audio/m4a'
        }
      });

      const result = await this.model.generateContent(parts);
      return result.response.text().trim();
    } catch (error) {
      this.logger.error('Gemini Transcription error:', error);
      return 'Failed to transcribe audio.';
    }
  }
}
