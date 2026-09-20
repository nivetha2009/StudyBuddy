import { config } from '../../config/env.js';
import { postJson } from './httpClient.js';

export const anthropicProvider = {
  name: 'anthropic',

  async generate({ system, messages, json }) {
    const data = await postJson('https://api.anthropic.com/v1/messages', {
      headers: {
        'x-api-key': config.ai.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: {
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
        system: json ? `${system}\n\nRespond with raw JSON only.` : system,
        messages
      }
    });

    return (data?.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
  }
};
