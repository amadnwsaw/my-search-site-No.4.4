export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Hugging Face API key' });
  }

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/bert-base-uncased", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Suggest search terms related to: ${q}`,
      }),
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: 'Invalid Hugging Face response' });
    }

    const suggestions = data.map((item) => item.generated_text || item).filter(Boolean);
    res.status(200).json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Hugging Face API call failed' });
  }
}
