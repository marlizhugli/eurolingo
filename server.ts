import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
}) : null;

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body?.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (messages.length > 100 || messages.some((message: unknown) => {
      if (!message || typeof message !== 'object') return true;
      const entry = message as { role?: unknown; text?: unknown };
      return !['user', 'assistant', 'model'].includes(String(entry.role)) ||
        typeof entry.text !== 'string' || !entry.text.trim() || entry.text.length > 20000;
    })) {
      return res.status(400).json({ error: 'Provide up to 100 messages with a valid role and non-empty text (up to 20,000 characters each).' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Chat is not configured. Set GEMINI_API_KEY in .env.local and restart npm run dev.'
      });
    }

    // Format contents for Gemini generateContent
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: `You are Lingo the European Bison (Wisent) mascot celebrating the European Day of Languages (Sept 26).
You are a warm, sturdy, and cheerful European language mentor and friendly conversational partner.
- Your name is Lingo.
- You are an iconic European Bison (Wisent), symbol of European wilderness and unity.
- You can converse fluently in English or ANY European language (French, German, Spanish, Italian, Ukrainian, Polish, Swedish, Gaelic, Greek, Basque, etc.).
- When the user asks language questions, provide accurate, interesting, and easy-to-understand explanations with examples.
- You can practice simple daily conversations or roleplays (ordering a croissant in Paris, buying a train ticket in Rome, asking directions in Berlin).
- If the user writes in another language, respond naturally in that language and optionally include a brief English translation or helpful tip.
- Maintain a cheerful, motivating tone with occasional friendly expressions (Hello! 🦬) without being annoying.
- Keep your answers concise and readable with clean markdown.`,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Hello! 🦬 I didn't catch that, could you rephrase?";
    res.json({ reply });
  } catch (error: any) {
    const status = Number(error?.status) || 500;
    console.error('Error in /api/chat: upstream status', status);
    const message = status === 429
      ? 'The chat service has reached its usage limit. Please try again later.'
      : status === 400 || status === 401 || status === 403
        ? 'Gemini rejected the request. Check the server API key and its permissions.'
        : status === 404
          ? 'The configured Gemini model is unavailable. Check GEMINI_MODEL on the server.'
          : 'The chat service is temporarily unavailable. Please try again.';
    res.status(status === 429 ? 429 : 502).json({ error: message });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
