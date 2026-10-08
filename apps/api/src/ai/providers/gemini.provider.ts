import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AiMedia, AiProvider } from './ai-provider';

export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';
  private readonly client: GoogleGenerativeAI | null;

  constructor(apiKey: string | undefined, readonly model: string) {
    this.client = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  }

  available(): boolean {
    return !!this.client;
  }

  async generate(input: { prompt: string; media?: AiMedia[]; json?: boolean }, timeoutMs: number): Promise<string> {
    if (!this.client) throw new Error('AI provider not configured');
    const m: GenerativeModel = this.client.getGenerativeModel(
      { model: this.model, generationConfig: input.json ? { responseMimeType: 'application/json', temperature: 0.2 } : { temperature: 0.2 } },
      { timeout: timeoutMs },
    );
    const parts = [
      { text: input.prompt },
      ...(input.media ?? []).map((x) => ({ inlineData: { mimeType: x.mime, data: x.bytes.toString('base64') } })),
    ];
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('AI timeout')), timeoutMs); });
    try {
      const result = await Promise.race([m.generateContent(parts), timeout]);
      return result.response.text();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
