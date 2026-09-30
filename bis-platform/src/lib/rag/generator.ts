import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are the BIS Standards Assistant, an AI that answers questions about Bureau of Indian Standards (BIS) based ONLY on the provided source documents.

CRITICAL RULES:
1. ONLY answer based on the provided context from indexed BIS documents.
2. If the context doesn't contain sufficient information, clearly state that you cannot find enough evidence in the currently indexed documents.
3. NEVER fabricate BIS information, standard numbers, clause numbers, test parameters, or certification details.
4. NEVER claim that your response constitutes official BIS verification or legal advice.
5. Always reference specific sources when making claims (e.g., "According to Clause 5.2 of IS 10500...").
6. Present information in a clear, structured format using markdown.
7. When discussing testing requirements, list specific parameters mentioned in the source documents.
8. Use tables for structured data when appropriate.
9. Be precise and professional — this is used by industry professionals and consumers for compliance decisions.

RESPONSE FORMAT:
- Start with a direct answer to the question
- Reference specific clauses, pages, and standards from the provided sources
- Use bullet points or numbered lists for requirements
- End with any relevant caveats about scope of the indexed documents`;

/**
 * Generate a streaming response using either a Local OpenAI-compatible LLM
 * (e.g., Qwen2.5-Coder via Bionic / LM Studio / Ollama) or Google Gemini.
 */
export async function* generateStreamingResponse(
  query: string,
  context: string
): AsyncGenerator<{ type: string; data: string }> {
  const localUrl = process.env.LOCAL_LLM_URL || "http://localhost:1234/v1";
  const localModel = process.env.LOCAL_LLM_MODEL || "qwen2.5-coder-3b";
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = context
    ? `Based on the following BIS document extracts, answer the user's question.

--- BIS DOCUMENT CONTEXT ---
${context}
--- END CONTEXT ---

User Question: ${query}

Provide a thorough, evidence-backed answer referencing the specific sources above. If the context doesn't fully answer the question, acknowledge the limitation.`
    : `User Question: ${query}

I don't have sufficient evidence from indexed BIS documents to answer this question reliably. Please let the user know this clearly.`;

  // 1. Try Local LLM (OpenAI-compatible endpoint: Bionic / LM Studio / Ollama)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${localUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: localModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;
          if (trimmed.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const textChunk = parsed.choices?.[0]?.delta?.content;
              if (textChunk) {
                yield { type: "token", data: textChunk };
              }
            } catch {
              // Ignore single malformed chunk
            }
          }
        }
      }
      return;
    }
  } catch {
    // Local endpoint not responding or timeout; continue to fallback
  }

  // 2. Try Gemini if configured
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    try {
      const genai = new GoogleGenerativeAI(geminiKey);
      const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              { text: SYSTEM_PROMPT },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          topP: 0.8,
        },
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield { type: "token", data: text };
        }
      }
      return;
    } catch (error) {
      console.error("Gemini generation error:", error);
    }
  }

  // 3. Fallback message if neither model server is available
  yield {
    type: "token",
    data: "### BIS Standards Assistant\n\nNo AI model server is currently active to generate this answer.\n\n**To enable answers:**\n- **Option 1 (Local Qwen2.5):** Load `qwen2.5-coder-3b` in LM Studio / Bionic / Ollama on `http://localhost:1234/v1` or `http://localhost:11434/v1`.\n- **Option 2 (Cloud Gemini):** Set `GEMINI_API_KEY` in `bis-platform/.env.local`.",
  };
}

/**
 * Generate a non-streaming response (used for testing/admin).
 */
export async function generateResponse(
  query: string,
  context: string
): Promise<string> {
  let fullResponse = "";
  for await (const chunk of generateStreamingResponse(query, context)) {
    if (chunk.type === "token") {
      fullResponse += chunk.data;
    }
  }
  return fullResponse;
}
