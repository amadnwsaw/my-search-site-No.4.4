export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Hugging Face API key" });
  }

  if (!q) {
    return res.status(400).json({ error: "Missing query input" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: `Search: ${q}` }),
    });

    const data = await response.json();

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      return res.status(500).json({ error: "Invalid Hugging Face response" });
    }

    // 簡單拆出建議詞
    const generated = data[0].generated_text;
    const suggestions = generated
      .replace(`Search: ${q}`, "")
      .split(/[.,;!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 5); // 最多給 5 個建議

    return res.status(200).json({ suggestions });
  } catch (error) {
    return res.status(500).json({ error: "Hugging Face API call failed" });
  }
}
