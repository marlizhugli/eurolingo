import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: { reply?: string; error?: string }) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

const SYSTEM_INSTRUCTION = `You are Lingo the European Bison (Wisent) mascot celebrating the European Day of Languages (Sept 26).
You are a warm, sturdy, and cheerful European language mentor and friendly conversational partner.
- Your name is Lingo.
- You can converse fluently in English or any European language.
- Give accurate, interesting, easy-to-understand explanations and examples.
- You can practice simple daily conversations and roleplays.
- If the user writes in another language, respond naturally in that language and optionally include a brief English translation or tip.
- Keep answers concise and readable with clean markdown.`;

function readMessages(body: unknown): ChatMessage[] | null {
  let parsed = body;
  if (typeof body === 'string') {
    try {
      parsed = JSON.parse(body);
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== 'object') return null;
  const messages = (parsed as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 100) return null;

  const valid = messages.every((message): message is ChatMessage => {
    if (!message || typeof message !== 'object') return false;
    const entry = message as { role?: unknown; text?: unknown };
    return ['user', 'assistant', 'model'].includes(String(entry.role)) &&
      typeof entry.text === 'string' && entry.text.trim().length > 0 && entry.text.length <= 20000;
  });

  return valid ? messages : null;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const messages = readMessages(req.body);
  if (!messages) {
    res.status(400).json({ error: 'Provide a valid, non-empty messages array.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'Chat is not configured on this deployment. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy.',
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map((message) => ({
      role: message.role === 'assistant' || message.role === 'model' ? 'model' : 'user',
      parts: [{ text: message.text }],
    }));
    const modelCandidates = [
      process.env.GEMINI_MODEL,
      'gemini-3.8-flash',
      'gemini-3.6-flash',
    ].filter((model, index, models): model is string => Boolean(model) && models.indexOf(model) === index);

    let response: Awaited<ReturnType<typeof ai.models.generateContent>> | null = null;
    let lastError: unknown;

    for (const model of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        break;
      } catch (error: unknown) {
        lastError = error;
        continue;
      }
    }

    if (!response) throw lastError;

    res.status(200).json({
      reply: response.text || "I didn't get a response. Could you ask again?",
    });
  } catch (error: unknown) {
    const status = Number((error as { status?: unknown })?.status) || 500;
    const message = status === 429
      ? 'The chat service has reached its usage limit. Please try again later.'
      : [400, 401, 403].includes(status)
        ? 'Gemini rejected the request. Check the API key and its permissions in Vercel.'
        : status === 404
          ? 'The configured Gemini model is unavailable.'
          : 'The chat service is temporarily unavailable. Please try again.';

    res.status(status === 429 ? 429 : 502).json({ error: message });
  }
}
