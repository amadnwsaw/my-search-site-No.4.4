export default async function handler(req, res) {
  const { keyword } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const prompt = `請根據「${keyword}」提供 5 個延伸搜尋建議，格式為 JSON 陣列，例如：["建議1", "建議2", "建議3"]`;

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

  try {
    const suggestions = JSON.parse(data.choices[0].message.content);
    res.status(200).json({ suggestions });
  } catch (e) {
    res.status(200).json({ suggestions: [] });
  }
}
