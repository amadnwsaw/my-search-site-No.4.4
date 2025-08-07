export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Hugging Face API key' });
  }

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Search suggestions for: ${q}`,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        }
      }),
    });

    const data = await response.json();

    console.log('Hugging Face API response:', data);  // 加這行

    // 先把回應直接丟給前端看
    res.status(200).json({ raw: data });

  } catch (error) {
    console.error('Hugging Face API call error:', error);
    res.status(500).json({ error: 'Hugging Face API call failed' });
  }
}
