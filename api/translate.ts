import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const { word, direction = "en-tl", image, mode, inputMode } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "missing_key" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. SUPREME LENS VISION PIPELINE
    if (image && mode) {
      let promptText = "";
      if (mode === 'EN') promptText = "Extract the text in this image and translate it to English. Give a brief, cool description. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'KO') promptText = "Extract the text in this image and translate it to modern Korean. Give a brief description in Korean. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'HAN') promptText = "Extract the text in this image and translate it into simple, Romanized Korean words (standard alphabet, no special characters). Do not describe it, just give the literal Korean words.";

      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          promptText,
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
        ],
        config: {
          // Keeps 3.5 Flash's quality for image extraction but trims
          // the reasoning effort to cut latency on this call.
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      let text = response.text ?? '';
      text = text.replace(/[*#]/g, '');

      return new Response(JSON.stringify({ translation: text.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. TEXT TRANSLATOR PIPELINE
    else if (word) {
      let sourceLang = "Korean";
      let targetLang = "English";
      if (direction === "ko-en") { sourceLang = "Korean"; targetLang = "English"; }
      else if (direction === "en-ko") { sourceLang = "English"; targetLang = "Korean"; }
      else if (direction === "han-ko") { sourceLang = "Hangul"; targetLang = "Korean"; }
      else if (direction === "han-en") { sourceLang = "Hangul"; targetLang = "English"; }
      let prompt = `Translate the following from ${sourceLang} to ${targetLang}. Return ONLY the direct translation. Do not include notes, options, or markdown. Word: ${word}`;

      if (inputMode === 'conversation') {
        prompt = `You are "KTS Hangul Supreme Translator", an elite Korean streetwear-themed translator.
Translate the following text from ${sourceLang} to ${targetLang}.

STRICT REQUIREMENTS:
1. If translating English to Korean: Translate directly into stylized modern conversational Korean (Hangul), and output the corresponding English Romanization (pronunciation guide) alongside a breakdown of slang/nuance.
2. If translating Korean to English: Translate directly into stylized modern English.
3. Keep the format clean, edgy, and easily readable.

Text to translate:
${word}`;
      }

      // Plain word/sentence translation — Flash-Lite is fast enough
      // and accurate enough for this, no reasoning overhead needed.
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt
      });

      let text = response.text ?? '';
      text = text.replace(/[*#]/g, '');

      return new Response(JSON.stringify({ translation: text.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error: any) {
    console.error("Endpoint error:", error);

    if (error.status === 503 || error.message?.includes('503')) {
      return new Response(JSON.stringify({ error: 'server_busy' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    if (error.message?.includes('429') || error.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: 3600 }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}