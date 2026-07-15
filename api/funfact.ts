import { GoogleGenAI } from '@google/genai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, koreanWord } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !englishWord || !koreanWord) {
      return new Response(JSON.stringify({ fact: null }), { status: 200 });
    }

    const prompt = `You are a fun South Korean culture and language expert. Generate ONE short, surprising fun fact about modern South Korean culture, Seoul streetwear, Hangul history (King Sejong), or K-culture specifically related to the word "${koreanWord}" (which means "${englishWord}" in English). Keep it to 1-2 sentences. Make it feel like a cool discovery, not a textbook definition.
    CRITICAL: Output ONLY a raw JSON object. NO markdown, NO code blocks.
    Format: {"fact": "..."}`;

    const ai = new GoogleGenAI({ apiKey });

    // Lightweight text task — no reasoning depth needed, so we use
    // Flash-Lite instead of 3.5 Flash for lower latency + cost.
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt
    });

    const textResponse = response.text ?? '';

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return new Response(JSON.stringify({ fact: null }), { status: 200 });

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Fun Fact Error:", error);
    return new Response(JSON.stringify({ fact: null }), { status: 200 });
  }
}