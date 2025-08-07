export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API key' });
  }

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `請根據 "${q}" 提供 5 個相關的搜尋建議，用逗號分隔。`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data || !data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      return res.status(500).json({ error: 'Invalid Gemini response', raw: data });
    }

    const text = data.candidates[0].content.parts[0].text;

    const suggestions = text
      .split(/[\n,;.]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 5);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Gemini API call failed:', error);
    res.status(500).json({ error: 'Gemini API call failed', details: error.message || error.toString() });
  }
}
