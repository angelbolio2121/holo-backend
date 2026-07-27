import { Readable } from 'node:stream';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET' && req.query.ping) {
    return res.status(200).json({ ok: true });
  }

  const text = req.method === 'GET' ? req.query.text : (req.body || {}).text;

  if (!text) {
    return res.status(400).json({ error: 'Falta el texto a convertir' });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY no esta configurada en Vercel.' });
  }

  if (!process.env.ELEVENLABS_VOICE_ID) {
    return res.status(500).json({ error: 'ELEVENLABS_VOICE_ID no esta configurada en Vercel.' });
  }

  try {
    const url =
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream` +
      `?optimize_streaming_latency=3&output_format=mp3_44100_64`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',
        language_code: 'es',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
