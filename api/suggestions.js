export default async function handler(req, res) {
  const { keyword } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const prompt = `根據「${keyword}」，請提供 5 個延伸搜尋建議，每個建議以換行分隔`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  const suggestions = text
    .split('\n')
    .map(line => line.replace(/^\d+[\.\s-]*/, '').trim())
    .filter(Boolean);

  res.status(200).json({ suggestions });
}
