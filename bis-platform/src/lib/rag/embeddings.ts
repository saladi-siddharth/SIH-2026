import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate embeddings using Local embedding endpoint (OpenAI-compatible) or Gemini text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const localUrl = process.env.LOCAL_EMBEDDING_URL || process.env.LOCAL_LLM_URL || "http://localhost:1234/v1";
  const localModel = process.env.LOCAL_EMBEDDING_MODEL || "text-embedding-nomic-embed-text-v1.5";
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Try Local Embeddings (OpenAI compatible)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${localUrl.replace(/\/+$/, "")}/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: localModel,
        input: text,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.data?.[0]?.embedding) {
        return data.data[0].embedding;
      }
    }
  } catch {
    // Continue to Gemini or fallback
  }

  // 2. Try Gemini
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    try {
      const genai = new GoogleGenerativeAI(geminiKey);
      const model = genai.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (e) {
      console.warn("Gemini embedding error:", e);
    }
  }

  // 3. Fallback: 768-dimension zero vector
  return new Array(768).fill(0);
}

/**
 * Generate a batch of embeddings
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i += 5) {
    const batch = texts.slice(i, i + 5);
    const results = await Promise.all(
      batch.map((text) => generateEmbedding(text))
    );
    embeddings.push(...results);
    if (i + 5 < texts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return embeddings;
}
