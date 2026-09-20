import { config } from '../../config/env.js';
import { postJson } from './httpClient.js';

/**
 * Works with OpenAI and every OpenAI-compatible API
 * (Groq, OpenRouter, Together, LM Studio, Ollama's /v1 endpoint).
 * Swap providers by changing AI_BASE_URL and AI_MODEL in .env.
 */
export const openaiProvider = {
  name: 'openai',

  async generate({ system, messages, json }) {
    const payload = {
      model: config.ai.model,
      max_tokens: config.ai.maxTokens,
      temperature: config.ai.temperature,
      messages: [{ role: 'system', content: system }, ...messages]
    };

    if (json) payload.response_format = { type: 'json_object' };

    const data = await postJson(`${config.ai.baseUrl}/chat/completions`, {
      headers: { Authorization: `Bearer ${config.ai.apiKey}` },
      body: payload
    });

    return data?.choices?.[0]?.message?.content ?? '';
  }
};
