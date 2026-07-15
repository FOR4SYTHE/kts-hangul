export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { text, lang = "fil-PH" } = await req.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    // 1. ElevenLabs Attempt
    if (process.env.ELEVENLABS_API_KEY) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/pNInz6obbfDQGcgMyIGb`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      });

      if (response.ok) {
        return new Response(await response.arrayBuffer(), {
          status: 200,
          headers: { 'Content-Type': 'audio/mpeg' }
        });
      }
    }

    // 2. Google Cloud TTS Attempt
    if (process.env.GOOGLE_TTS_API_KEY) {
      const languageCode = lang === "en-US" ? "en-US" : "fil-PH";
      const voiceName = lang === "en-US" ? "en-US-Neural2-F" : "fil-PH-Neural2-A";
      
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode, name: voiceName },
            audioConfig: { audioEncoding: "MP3" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.audioContent) {
          // Convert base64 to Uint8Array for Edge Response
          const binaryString = atob(data.audioContent);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          return new Response(bytes, {
            status: 200,
            headers: { 'Content-Type': 'audio/mpeg' }
          });
        }
      }
    }

    // 3. Fallback: Free Google Translate TTS
    const tl = lang === "en-US" ? "en" : "tl";
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;
    
    const fallbackRes = await fetch(url);
    if (fallbackRes.ok) {
      return new Response(await fallbackRes.arrayBuffer(), {
        status: 200,
        headers: { 'Content-Type': 'audio/mpeg' }
      });
    }

    throw new Error("All TTS engines failed");

  } catch (error) {
    console.error("TTS error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate TTS" }), { 
      status: 500, headers: { 'Content-Type': 'application/json' } 
    });
  }
}