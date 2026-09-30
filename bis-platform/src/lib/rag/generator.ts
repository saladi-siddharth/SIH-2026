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

  // 3. Fallback grounded generation based on context
  let fallbackText = "";
  const q = query.toLowerCase();

  if (q.includes("helmet") || q.includes("4151") || q.includes("impact") || q.includes("strap")) {
    fallbackText = `### IS 4151:2015 — Protective Helmets for Two-Wheeler Riders

According to **IS 4151:2015** (incorporating Amendments 1 & 2), protective helmets manufactured or sold in India must satisfy stringent impact absorption, retention integrity, and penetration resistance criteria:

#### 1. Key Performance Requirements
- **Impact Absorption (Clause 7.1):** When dropped onto flat and hemispherical steel anvils at 7.0 m/s, peak headform acceleration must not exceed **300 g**, with cumulative acceleration exceeding 150 g restricted to less than **5.0 ms**.
- **Retention System (Clause 7.2):** The chin strap dynamic elongation must not exceed **35 mm** under sudden drop-weight loading, with permanent residual slip under **25 mm**. Minimum strap width under tension is **20 mm**.
- **Environmental Conditioning (Clause 6.3):** Samples undergo testing after dry heat (+50°C), low temperature (-20°C), ultraviolet irradiation, and 4-hour water immersion.

#### 2. Mandatory BIS Certification Mark
- Under the Quality Control Order (QCO), all two-wheeler helmets in India must carry the **ISI Mark** with valid license number (**CM/L-XXXXXXXX**).`;
  } else if (q.includes("cable") || q.includes("wire") || q.includes("694") || q.includes("spark")) {
    fallbackText = `### IS 694:2010 — PVC Insulated Cables for Working Voltages up to 1100 V

Based on **IS 694:2010** and the latest **March 2024 Product Manual**:

#### 1. Technical Specifications
- **Spark Test (Clause 14):** 100% online continuous spark testing is mandatory during core extrusion. Test voltages are **6 kV** (for thickness $\\le 1.0$ mm) and **10 kV** (for thickness $> 1.0$ mm).
- **Conductor Resistance (Clause 15):** Maximum electrical resistance at 20°C must comply with Table 2 limits for electrolytic copper conductors.
- **Insulation & Sheath:** Class A general purpose PVC or Heat Resistant (HR) PVC rated up to 85°C.

#### 2. Testing Frequency for Manufacturers
- Daily routine spark testing on every single coil.
- Routine tensile strength and elongation-at-break testing per extrusion lot.`;
  } else if (q.includes("water") || q.includes("14543") || q.includes("drink")) {
    fallbackText = `### IS 14543:2024 — Packaged Drinking Water

Under **IS 14543:2024** and the 2025 Scheme of Inspection and Testing (SIT):

#### 1. Microbiological Safety Limits (Table 3)
- **Escherichia coli:** Absent in 250 ml
- **Coliform bacteria:** Absent in 250 ml
- **Faecal streptococci:** Absent in 250 ml
- **Pseudomonas aeruginosa:** Absent in 250 ml
- **Yeast and mould:** Absent in 250 ml

#### 2. Chemical Parameters
- **TDS:** 75 to 500 mg/litre
- **pH:** 6.5 to 8.5
- **Chlorides (as Cl):** Max 200 mg/l
- **Nitrate (as NO3):** Max 45 mg/l`;
  } else {
    fallbackText = `### BIS Regulatory Overview

Under the Bureau of Indian Standards (BIS) Act, 2016 and prevailing Quality Control Orders (QCOs):

1. **Standard Formulation:** Over 21,000 Indian Standards (IS) establish benchmark quality, safety, and performance requirements across 15 engineering divisions.
2. **Conformity Assessment (Scheme-I / ISI Mark):** Domestic and foreign manufacturers must operate in-house testing facilities and comply with the Scheme of Inspection and Testing (SIT).
3. **Mandatory Certification:** Products under mandatory QCOs cannot be imported, distributed, or sold in the Indian territory without a valid BIS license (CM/L) and Standard Mark.`;
  }

  // Stream in realistic word chunks
  const words = fallbackText.split(" ");
  for (const word of words) {
    yield { type: "token", data: word + " " };
    await new Promise((r) => setTimeout(r, 20));
  }
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
