export default async function handler(req, res) {
  const { keyword } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }
  if (!keyword || keyword.trim().length === 0) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const prompt = `請根據關鍵字「${keyword}」，用繁體中文列出5個與此關鍵字相關的搜尋建議，格式用換行分隔，每一行只寫建議詞。`;

  try {
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
      .map(line => line.replace(/^\d+[\.\-]?\s*/, '').trim())
      .filter(Boolean);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
}
