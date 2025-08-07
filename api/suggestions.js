export default async function handler(req, res) {
  const { keyword } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }
  if (!keyword || keyword.trim().length === 0) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const prompt = `請幫我列出5個與「${keyword}」相關的繁體中文搜尋建議，每個建議詞一行，請只回覆建議詞，不要其他文字。`;

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

    console.log('OpenAI 回傳:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'OpenAI response invalid', raw: data });
    }

    const text = data.choices[0].message.content;

    const suggestions = text
      .split('\n')
      .map(line => line.replace(/^\d+[\.\-]?\s*/, '').trim())
      .filter(Boolean);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('OpenAI 請求失敗:', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
}
