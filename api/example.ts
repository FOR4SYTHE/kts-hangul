import { GoogleGenAI } from '@google/genai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, koreanWord } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "missing_key" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (!englishWord || !koreanWord) {
      return new Response(JSON.stringify({ error: 'missing_input' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a modern Korean language tutor. Write ONE short, casual, modern, conversational Korean example sentence using the phrase: "${koreanWord}". Provide the English translation and the Romanized pronunciation.
CRITICAL: Output ONLY a raw JSON object. NO markdown, NO code blocks.
Format: {"koreanSentence": "[Hangul] ([Romanization])", "englishTranslation": "..."}`;

    // Lightweight text task — no reasoning depth needed, so we use
    // Flash-Lite instead of 3.5 Flash for lower latency + cost.
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt
    });

    const textResponse = response.text ?? '';
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("AI response was not valid JSON.");

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Example Error:", error);
    if (error.message?.includes('429') || error.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: 60 }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'api_error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}