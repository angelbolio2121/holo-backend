export default async function handler(req, res) {
  // Permite que tu HTML (abierto localmente o desde cualquier dominio) llame a este endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Falta el arreglo "messages" en el body' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en Vercel. Ve a Settings > Environment Variables.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'Eres un asistente holográfico en una demo en vivo. Responde en español, directo, sin relleno, en 1-3 frases cortas — tus respuestas se muestran como subtítulos flotantes sobre una proyección, así que deben ser breves y claras.',
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
