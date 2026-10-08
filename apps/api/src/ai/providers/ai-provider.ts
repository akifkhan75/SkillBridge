export interface AiMedia {
  mime: string;
  bytes: Buffer;
}

/** Product code depends on this, never on a vendor SDK, so the model can change without rewrites (doc 08). */
export interface AiProvider {
  readonly name: string;
  readonly model: string;
  available(): boolean;
  /** Returns the raw text the model produced. Throws on timeout/transport errors. */
  generate(input: { prompt: string; media?: AiMedia[]; json?: boolean }, timeoutMs: number): Promise<string>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
