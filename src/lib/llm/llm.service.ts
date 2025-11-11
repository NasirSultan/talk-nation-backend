import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LLMService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async detectHateSpeech(text: string): Promise<boolean> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Detect if the following text contains hate speech. Answer yes or no.' },
        { role: 'user', content: text }
      ]
    });

    const result = response.choices[0].message?.content || 'no';
    return result.toLowerCase().includes('yes');
  }
}
