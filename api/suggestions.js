export default async function handler(req, res) {
  const { keyword } = req.body;

  const prompt = `請根據「${keyword}」這個搜尋字詞，推薦 5 個相關搜尋關鍵字，用逗號分隔輸出。`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content || '';
  const suggestions = text.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);

  res.status(200).json({ suggestions });
}

