import { config } from '../../config/env.js';
import { postJson } from './httpClient.js';

export const geminiProvider = {
  name: 'gemini',

  async generate({ system, messages, json }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.ai.model}:generateContent?key=${config.ai.apiKey}`;

    const data = await postJson(url, {
      body: {
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }]
        })),
        generationConfig: {
          temperature: config.ai.temperature,
          maxOutputTokens: config.ai.maxTokens,
          ...(json ? { responseMimeType: 'application/json' } : {})
        }
      }
    });

    return (data?.candidates?.[0]?.content?.parts || []).map((part) => part.text || '').join('\n');
  }
};
