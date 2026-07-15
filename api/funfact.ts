import { GoogleGenAI } from '@google/genai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, tagalogWord } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !englishWord || !tagalogWord) {
      return new Response(JSON.stringify({ fact: null }), { status: 200 });
    }

    const prompt = `You are a fun Filipino language trivia expert. Generate ONE short, surprising fun fact about the Tagalog or Filipino language, specifically related to the word "${tagalogWord}" (which means "${englishWord}" in English). Keep it to 1-2 sentences. Make it feel like a cool discovery, not a textbook definition.
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